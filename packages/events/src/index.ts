export const fleetEvents = {
  agentRegistered: "fleet.agent.registered.v1",
  agentHeartbeat: "fleet.agent.heartbeat.v1",
  workloadAssigned: "fleet.workload.assigned.v1",
  workloadRebalanced: "fleet.workload.rebalanced.v1",
  scalingTriggered: "fleet.scaling.triggered.v1"
} as const;

export type FleetEventName = (typeof fleetEvents)[keyof typeof fleetEvents];

export type FleetEventEnvelope = {
  id: string;
  name: FleetEventName;
  emittedAt: string;
  payload: Record<string, unknown>;
};

const outbox: FleetEventEnvelope[] = [];

export function publishFleetEvent(event: FleetEventEnvelope): void {
  outbox.push(event);
}

export function readFleetOutbox(): FleetEventEnvelope[] {
  return [...outbox];
}
