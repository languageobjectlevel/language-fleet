export type ConnectorStatus = {
  operatorReachable: boolean;
  commerceReachable: boolean;
  compatibility: "ok" | "degraded";
};

export function checkConnectorStatus(): ConnectorStatus {
  const operatorReachable = true;
  const commerceReachable = true;
  return {
    operatorReachable,
    commerceReachable,
    compatibility: operatorReachable && commerceReachable ? "ok" : "degraded"
  };
}

export function buildConnectorPing(target: "operator" | "commerce", correlationId: string): Record<string, string> {
  return {
    target,
    correlationId,
    emittedAt: new Date().toISOString()
  };
}
