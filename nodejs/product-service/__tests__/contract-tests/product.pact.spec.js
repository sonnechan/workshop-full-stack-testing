const { Verifier } = require("@pact-foundation/pact");

const token = process.env.CONTRACT_TEST_AUTH_TOKEN;

describe("Pact Verification", () => {
  test("verifies the pact", async () => {
    const opts = {
      customProviderHeaders: [`x-access-token: ${token}`],
      provider: "product-service",
      providerBaseUrl: "http://localhost:3002",

      pactBrokerUrl: "http://localhost:9292",
      consumerVersionSelectors: ["1.0.0"],
      pactBrokerUsername: "pact_workshop",
      pactBrokerPassword: "pact_workshop",
      publishVerificationResult: true,
      providerVersion: "1.0.0",
      log: "INFO", // Set to "DEBUG" to see output
    };
    return new Verifier(opts).verifyProvider().then((output) => {
      console.log(output);
    });
  });
});