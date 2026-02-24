import type { WorkloadLease } from "@language-fleet/contracts";

export function renewLease(lease: WorkloadLease, ttlSeconds: number): WorkloadLease {
  return {
    ...lease,
    expiresAt: new Date(Date.now() + ttlSeconds * 1000).toISOString()
  };
}
