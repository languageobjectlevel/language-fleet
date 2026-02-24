import type { WorkloadLease } from "@language-fleet/contracts";

export function renewLease(lease: WorkloadLease, ttlSeconds: number): WorkloadLease {
  if (ttlSeconds < 5 || ttlSeconds > 3600) {
    throw new Error("ttlSeconds must be between 5 and 3600");
  }

  return {
    ...lease,
    expiresAt: new Date(Date.now() + ttlSeconds * 1000).toISOString()
  };
}

export function isLeaseExpired(lease: WorkloadLease, now: Date = new Date()): boolean {
  return new Date(lease.expiresAt).getTime() <= now.getTime();
}
