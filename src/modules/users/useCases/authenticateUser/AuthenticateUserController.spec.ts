import { Connection } from "typeorm";
import { app } from "../../../../app";
import createConnection from "../../../../database";
import { hash } from "bcryptjs";
import request from "supertest";
import { v4 as uuid } from "uuid";

let connection: Connection;

describe("Authenticate User Controller", () => {
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

  it("should be able to authenticate an user", async () => {
    const response = await request(app).post("/api/v1/sessions").send({
      email: "admin@rentx.com.br",
      password: "admin",
    });

    expect(response.status).toBe(200);
  });
});
