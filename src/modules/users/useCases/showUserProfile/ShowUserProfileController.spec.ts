import { Connection } from "typeorm";
import { app } from "../../../../app";
import createConnection from "../../../../database";
import { hash } from "bcryptjs";
import request from "supertest";
import { v4 as uuid } from "uuid";

let connection: Connection;

describe("Show User Profile Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuid();

    const password = await hash("admin", 8);

    await connection.query(
      `INSERT INTO USERS(id, name, email, password)
        values('${id}', 'admin', 'admin@gmail.com', '${password}')
      `
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to show an user profile", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "admin@gmail.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .get("/api/v1/profile")
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.body).toHaveProperty("id");
  });
});
