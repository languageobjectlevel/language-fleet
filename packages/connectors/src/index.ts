export type ConnectorStatus = {
  operatorReachable: boolean;
  commerceReachable: boolean;
};

export function checkConnectorStatus(): ConnectorStatus {
  return {
    operatorReachable: true,
    commerceReachable: true
  };
}
