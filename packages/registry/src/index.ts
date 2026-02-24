import type { AgentRegistration } from "@language-fleet/contracts";

export function registerAgent(input: AgentRegistration): AgentRegistration {
  if (!input.agentId.trim()) {
    throw new Error("agentId is required");
  }

  return input;
}
