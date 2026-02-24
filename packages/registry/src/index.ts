import type { AgentRegistration, HeartbeatSnapshot } from "@language-fleet/contracts";

export function registerAgent(input: AgentRegistration): AgentRegistration {
  if (!input.agentId.trim()) {
    throw new Error("agentId is required");
  }

  return input;
}

export function registerHeartbeat(input: HeartbeatSnapshot): HeartbeatSnapshot {
  if (input.cpuLoad < 0 || input.cpuLoad > 100) {
    throw new Error("cpuLoad must be between 0 and 100");
  }

  if (input.memoryLoad < 0 || input.memoryLoad > 100) {
    throw new Error("memoryLoad must be between 0 and 100");
  }

  return input;
}
