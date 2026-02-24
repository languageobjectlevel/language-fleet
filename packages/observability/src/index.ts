export type FleetMetrics = Record<string, number>;

const metrics: FleetMetrics = {};

export function increment(metric: string): void {
  metrics[metric] = (metrics[metric] ?? 0) + 1;
}

export function gauge(metric: string, value: number): void {
  metrics[metric] = value;
}

export function snapshot(): FleetMetrics {
  return { ...metrics };
}
