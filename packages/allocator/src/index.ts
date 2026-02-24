import type { WorkloadLease } from "@language-fleet/contracts";
import type { HeartbeatSnapshot } from "@language-fleet/contracts";

export function assignWorkload(workloadId: string, agentId: string, ttlSeconds: number): WorkloadLease {
  return {
    leaseId: `lease_${workloadId}`,
    workloadId,
    agentId,
    expiresAt: new Date(Date.now() + ttlSeconds * 1000).toISOString()
  };
}

export function selectAgentForWorkload(heartbeats: HeartbeatSnapshot[]): string | null {
  const candidates = heartbeats
    .filter((snapshot) => snapshot.healthy)
    .sort((left, right) => left.cpuLoad + left.memoryLoad - (right.cpuLoad + right.memoryLoad));

  return candidates[0]?.agentId ?? null;
}
