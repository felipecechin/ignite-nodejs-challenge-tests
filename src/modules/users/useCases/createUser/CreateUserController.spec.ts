import { Connection } from "typeorm";
import { app } from "../../../../app";
import createConnection from "../../../../database";
import request from "supertest";

let connection: Connection;

describe("Create User Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to create an user", async () => {
    const response = await request(app).post("/api/v1/users").send({
      name: "felipe admin",
      email: "admin@hotmail.com",
      password: "admin",
    });

    expect(response.status).toBe(201);
  });
});
