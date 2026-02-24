export type FleetMetrics = Record<string, number>;
export type FleetLog = {
  level: "info" | "warn" | "error";
  event: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
};

const metrics: FleetMetrics = {};
const logs: FleetLog[] = [];

export function increment(metric: string): void {
  metrics[metric] = (metrics[metric] ?? 0) + 1;
}

export function gauge(metric: string, value: number): void {
  metrics[metric] = value;
}

export function snapshot(): FleetMetrics {
  return { ...metrics };
}

export function log(record: Omit<FleetLog, "timestamp">): void {
  logs.push({
    ...record,
    timestamp: new Date().toISOString()
  });
}

export function readLogs(): FleetLog[] {
  return [...logs];
}
