import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for product", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should create a product", async () => {
    const response = await request(app)
      .post("/product")
      .send({
        type: "a",
        name: "sacola",
        price: 12.99,
      });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("sacola");
    expect(response.body.price).toBe(12.99);
  });

  it("should not create a product", async () => {
    const response = await request(app).post("/product").send({
      name: "sacola",
    });
    expect(response.status).toBe(500);
  });

  it("should list all product", async () => {
    const response = await request(app)
      .post("/product")
      .send({
        type:"a",
        name: "Cataflam",
        price: 30.57,
      });
    expect(response.status).toBe(200);
    const response2 = await request(app)
      .post("/product")
      .send({
        type:"b",
        name: "Amoxicilina",
        price: 10.79,
      });
    expect(response2.status).toBe(200);

    const listResponse = await request(app).get("/product").send();

    expect(listResponse.status).toBe(200);
    expect(listResponse.body.products.length).toBe(2);
    const product = listResponse.body.products[0];
    expect(product.name).toBe("Cataflam");
    expect(product.price).toBe(30.57);
    const product2 = listResponse.body.products[1];
    expect(product2.name).toBe("Amoxicilina");
    expect(product2.price).toBe(10.79 * 2); 
  });
});
