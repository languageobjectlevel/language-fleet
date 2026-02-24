const allowedRegions = new Set(["us-east", "us-west", "eu-central"]);

export function assertAllowedRegion(region: string): void {
  if (!allowedRegions.has(region)) {
    throw new Error(`Region ${region} is not allowed`);
  }
}

export function assertNoReplayKeyReuse(previous: Set<string>, key: string): void {
  if (previous.has(key)) {
    throw new Error("Replay key reuse detected");
  }
}

export function requireServiceToken(token: string | undefined, expectedToken: string): void {
  if (!token || token !== expectedToken) {
    throw new Error("Invalid service token");
  }
}
