import { Connection } from "typeorm";
import { app } from "../../../../app";
import createConnection from "../../../../database";
import { hash } from "bcryptjs";
import request from "supertest";
import { v4 as uuid } from "uuid";

let connection: Connection;

describe("Create Statement Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuid();

    const password = await hash("admin", 8);

    await connection.query(
      `INSERT INTO USERS(id, name, email, password)
        values('${id}', 'admin', 'admin@rentx.com.br', '${password}')
      `
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to create an deposit statement for user", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "admin@rentx.com.br",
      password: "admin",
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 320,
        description: "deposit",
      }).set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(201);
  });

  it("should be able to create an withdraw statement for user", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "admin@rentx.com.br",
      password: "admin",
    });

    const { token } = responseToken.body;

    await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 320,
        description: "deposit",
      }).set({
        Authorization: `Bearer ${token}`,
      });

    const response = await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        amount: 100,
        description: "withdraw",
      }).set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(201);
  });
});
