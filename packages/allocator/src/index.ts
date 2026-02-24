import type { WorkloadLease } from "@language-fleet/contracts";

export function assignWorkload(workloadId: string, agentId: string, ttlSeconds: number): WorkloadLease {
  return {
    leaseId: `lease_${workloadId}`,
    workloadId,
    agentId,
    expiresAt: new Date(Date.now() + ttlSeconds * 1000).toISOString()
  };
}
