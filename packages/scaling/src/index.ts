import type { ScalingDecision } from "@language-fleet/contracts";

export function evaluateScaling(policyName: string, desiredAgents: number, reason: string): ScalingDecision {
  if (desiredAgents < 1) {
    throw new Error("desiredAgents must be at least 1");
  }

  return {
    decisionId: `scale_${Date.now()}`,
    policyName,
    desiredAgents,
    reason,
    decidedAt: new Date().toISOString()
  };
}

export function evaluateByUtilization(
  policyName: string,
  currentAgents: number,
  averageCpuLoad: number
): ScalingDecision {
  if (currentAgents < 1) {
    throw new Error("currentAgents must be at least 1");
  }

  const desiredAgents = averageCpuLoad >= 75 ? currentAgents + 1 : averageCpuLoad <= 20 ? Math.max(currentAgents - 1, 1) : currentAgents;
  const reason =
    averageCpuLoad >= 75
      ? "Scale out due to sustained CPU pressure"
      : averageCpuLoad <= 20
        ? "Scale in due to sustained low utilization"
        : "No scaling adjustment required";

  return evaluateScaling(policyName, desiredAgents, reason);
}
