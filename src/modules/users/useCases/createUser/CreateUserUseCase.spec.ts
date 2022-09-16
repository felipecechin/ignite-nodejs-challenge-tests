import "reflect-metadata"

import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";
import { ICreateUserDTO } from "./ICreateUserDTO";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });
  it("should be able to create an user", async () => {
    const user: ICreateUserDTO = {
      email: "user@test.com",
      password: "1234",
      name: "user test",
    };

    const result = await createUserUseCase.execute(user);
    expect(result).toHaveProperty("id");
  });

  it("should not be able to create an existent user", async () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        email: "user@test.com",
        password: "1234",
        name: "user test",
      };

      await createUserUseCase.execute(user);

      const otherUser: ICreateUserDTO = {
        email: "user@test.com",
        password: "123456",
        name: "user test 2",
      };
      await createUserUseCase.execute(otherUser);
    }).rejects.toBeInstanceOf(CreateUserError);
  });
});
