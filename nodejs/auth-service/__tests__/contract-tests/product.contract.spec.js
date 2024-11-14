const productGateway = require("../../app/gateways/product.gateway");
const path = require("path");
const {
  PactV3,
  MatchersV3,
  SpecificationVersion,
} = require("@pact-foundation/pact");
const { like, eachLike } = MatchersV3;

const provider = new PactV3({
  consumer: "sunny-auth-service",
  provider: "product-service",
  log: path.resolve(process.cwd(), "logs", "pact.log"),
  logLevel: "warn",
  dir: path.resolve(process.cwd(), "pacts"),
  spec: SpecificationVersion.SPECIFICATION_VERSION_V2,
});

test("Success to get all products", async () => {
  // set up Pact interactions
  await provider.addInteraction({
    states: [{ description: "Valid JWT token" }],
    uponReceiving: "Get all products",
    withRequest: {
      method: "GET",
      path: "/api/products",
    },
    willRespondWith: {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: eachLike({
        id: like(1),
        name: like("product 1"),
        description: like("product 1 description"),
        price: like(100)
      }),
    },
  });

  await provider.executeTest(async (mockService) => {
    const products = await productGateway.callGetAllProducts(
      mockService.url,
      "mock token"
    );
    // Check json schema
    expect(products[0]).toEqual({
      id: expect.any(Number),
      name: expect.any(String),
      description: expect.any(String),
      price: expect.any(Number),
    });
  });
});