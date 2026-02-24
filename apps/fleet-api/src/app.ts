import Fastify from "fastify";
import type {
  AgentRegistration,
  FleetHealthReport,
  HeartbeatSnapshot,
  RebalancePlan,
  ScalingDecision,
  WorkloadLease
} from "@language-fleet/contracts";
import { registerAgent, registerHeartbeat } from "@language-fleet/registry";
import { assignWorkload, selectAgentForWorkload } from "@language-fleet/allocator";
import { isLeaseExpired, renewLease } from "@language-fleet/lease";
import { evaluateByUtilization, evaluateScaling } from "@language-fleet/scaling";
import { buildConnectorPing, checkConnectorStatus } from "@language-fleet/connectors";
import { assertAllowedRegion, assertNoReplayKeyReuse } from "@language-fleet/security";
import { gauge, increment, snapshot } from "@language-fleet/observability";
import { fleetEvents, publishFleetEvent, readFleetOutbox } from "@language-fleet/events";

const agents = new Map<string, AgentRegistration>();
const heartbeats = new Map<string, HeartbeatSnapshot>();
const leases = new Map<string, WorkloadLease>();
const replayKeys = new Set<string>();

export function createFleetApp() {
  const app = Fastify({ logger: false });

  app.post("/v1/agents/register", async (request, reply) => {
    const body = request.body as AgentRegistration;
    try {
      assertAllowedRegion(body.region);
      assertNoReplayKeyReuse(replayKeys, `register:${body.agentId}`);
      replayKeys.add(`register:${body.agentId}`);
    } catch (error) {
      return reply.code(400).send({ error: (error as Error).message });
    }

    const registered = registerAgent({ ...body, registeredAt: new Date().toISOString() });
    agents.set(registered.agentId, registered);
    increment("fleet.agent.registered.v1");
    publishFleetEvent({
      id: `evt_${registered.agentId}`,
      name: fleetEvents.agentRegistered,
      emittedAt: new Date().toISOString(),
      payload: registered
    });

    return reply.code(201).send(registered);
  });

  app.post("/v1/agents/heartbeat", async (request, reply) => {
    const body = request.body as HeartbeatSnapshot;
    if (!agents.has(body.agentId)) {
      return reply.code(404).send({ error: "Agent not registered" });
    }

    const heartbeat = registerHeartbeat({ ...body, timestamp: new Date().toISOString() });
    heartbeats.set(body.agentId, heartbeat);
    increment("fleet.agent.heartbeat.v1");
    publishFleetEvent({
      id: `evt_hb_${heartbeat.agentId}`,
      name: fleetEvents.agentHeartbeat,
      emittedAt: new Date().toISOString(),
      payload: heartbeat
    });

    return reply.code(202).send(heartbeat);
  });

  app.post("/v1/workloads/assign", async (request, reply) => {
    const body = request.body as { workloadId: string; agentId?: string; ttlSeconds?: number };
    const resolvedAgentId =
      body.agentId ??
      selectAgentForWorkload(
        Array.from(heartbeats.values()).map((heartbeat) => ({
          ...heartbeat,
          healthy: heartbeat.healthy
        }))
      );

    if (!resolvedAgentId || !agents.has(resolvedAgentId)) {
      return reply.code(404).send({ error: "Agent not available" });
    }

    const lease = assignWorkload(body.workloadId, resolvedAgentId, body.ttlSeconds ?? 60);
    leases.set(lease.leaseId, lease);
    increment("fleet.workload.assigned.v1");
    publishFleetEvent({
      id: `evt_${lease.leaseId}`,
      name: fleetEvents.workloadAssigned,
      emittedAt: new Date().toISOString(),
      payload: lease
    });

    return reply.code(201).send(lease);
  });

  app.post("/v1/workloads/rebalance", async (request, reply) => {
    const body = request.body as { leaseId: string; toAgentId: string; ttlSeconds?: number };
    const lease = leases.get(body.leaseId);
    if (!lease) {
      return reply.code(404).send({ error: "Lease not found" });
    }

    if (!agents.has(body.toAgentId)) {
      return reply.code(404).send({ error: "Target agent not found" });
    }

    if (isLeaseExpired(lease)) {
      return reply.code(409).send({ error: "Lease expired; assignment must be renewed first" });
    }

    const renewed = renewLease({ ...lease, agentId: body.toAgentId }, body.ttlSeconds ?? 60);
    leases.set(renewed.leaseId, renewed);

    const plan: RebalancePlan = {
      planId: `plan_${Date.now()}`,
      moves: [{ workloadId: lease.workloadId, fromAgentId: lease.agentId, toAgentId: body.toAgentId }],
      createdAt: new Date().toISOString()
    };

    increment("fleet.workload.rebalanced.v1");
    publishFleetEvent({
      id: `evt_${plan.planId}`,
      name: fleetEvents.workloadRebalanced,
      emittedAt: new Date().toISOString(),
      payload: plan
    });

    return reply.code(200).send({ lease: renewed, plan });
  });

  app.post("/v1/scaling/policies", async (request, reply) => {
    const body = request.body as {
      policyName: string;
      desiredAgents?: number;
      reason?: string;
      currentAgents?: number;
      averageCpuLoad?: number;
    };

    const decision: ScalingDecision =
      typeof body.currentAgents === "number" && typeof body.averageCpuLoad === "number"
        ? evaluateByUtilization(body.policyName, body.currentAgents, body.averageCpuLoad)
        : evaluateScaling(body.policyName, body.desiredAgents ?? 1, body.reason ?? "Manual policy evaluation");
    increment("fleet.scaling.triggered.v1");
    publishFleetEvent({
      id: `evt_${decision.decisionId}`,
      name: fleetEvents.scalingTriggered,
      emittedAt: new Date().toISOString(),
      payload: decision
    });

    return reply.code(201).send(decision);
  });

  app.get("/v1/fleet/status", async (): Promise<FleetHealthReport> => {
    const healthyAgents = Array.from(heartbeats.values()).filter((hb) => hb.healthy).length;
    const unhealthyAgents = Array.from(heartbeats.values()).filter((hb) => !hb.healthy).length;
    gauge("fleet.active.leases", leases.size);

    return {
      healthyAgents,
      unhealthyAgents,
      activeLeases: leases.size,
      generatedAt: new Date().toISOString()
    };
  });

  app.get("/v1/agents/:agentId/health", async (request, reply) => {
    const params = request.params as { agentId: string };
    const heartbeat = heartbeats.get(params.agentId);
    if (!heartbeat) {
      return reply.code(404).send({ error: "Heartbeat not found" });
    }

    return reply.code(200).send(heartbeat);
  });

  app.get("/v1/connectors/status", async () => checkConnectorStatus());
  app.post("/v1/connectors/ping", async (request, reply) => {
    const body = request.body as { target: "operator" | "commerce"; correlationId: string };
    const ping = buildConnectorPing(body.target, body.correlationId);
    increment("fleet.connectors.pinged.v1");
    return reply.code(202).send(ping);
  });
  app.get("/v1/events/outbox", async () => ({ count: readFleetOutbox().length, items: readFleetOutbox() }));
  app.get("/v1/metrics", async () => snapshot());
  app.get("/v1/health/liveness", async () => ({ status: "ok" }));

  return app;
}
