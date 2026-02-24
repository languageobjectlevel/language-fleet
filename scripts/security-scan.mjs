const bannedTokens = ["password=", "AKIA", "PRIVATE KEY", "ghp_"];
const payload = JSON.stringify(process.env);
for (const token of bannedTokens) {
  if (payload.includes(token)) {
    console.error(`Potential secret material detected: ${token}`);
    process.exit(1);
  }
}
console.log("Security scan passed");
