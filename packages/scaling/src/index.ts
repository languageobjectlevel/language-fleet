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
