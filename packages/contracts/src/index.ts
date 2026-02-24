export type AgentRegistration = {
  agentId: string;
  region: string;
  capabilities: string[];
  registeredAt: string;
};

export type HeartbeatSnapshot = {
  agentId: string;
  healthy: boolean;
  cpuLoad: number;
  memoryLoad: number;
  timestamp: string;
};

export type WorkloadLease = {
  leaseId: string;
  workloadId: string;
  agentId: string;
  expiresAt: string;
};

export type RebalancePlan = {
  planId: string;
  moves: Array<{ workloadId: string; fromAgentId: string; toAgentId: string }>;
  createdAt: string;
};

export type ScalingDecision = {
  decisionId: string;
  policyName: string;
  desiredAgents: number;
  reason: string;
  decidedAt: string;
};

export type FleetHealthReport = {
  healthyAgents: number;
  unhealthyAgents: number;
  activeLeases: number;
  generatedAt: string;
};
