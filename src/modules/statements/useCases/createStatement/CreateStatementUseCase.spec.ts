import "reflect-metadata"

import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;

describe("Create Statement", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
  });
  it("should be able to create an statement", async () => {
    const user: ICreateUserDTO = {
      email: "user@test.com",
      password: "1234",
      name: "user test",
    };

    const userCreated = await createUserUseCase.execute(user);

    const result = await createStatementUseCase.execute({
      user_id: userCreated.id as string,
      type: "deposit" as any,
      amount: 100,
      description: "deposit test"
    });

    expect(result).toHaveProperty("id");
  });

  it("should not be able to create an statement to a non existent user", async () => {
    expect(async () => {
      await createStatementUseCase.execute({
        user_id: "non-existent-user-id",
        type: "deposit" as any,
        amount: 100,
        description: "deposit test"
      });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it("should not be able to create an statement with withdraw bigger than balance", async () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        email: "user@test.com",
        password: "1234",
        name: "user test",
      };

      const userCreated = await createUserUseCase.execute(user);

      await createStatementUseCase.execute({
        user_id: userCreated.id as string,
        type: "deposit" as any,
        amount: 100,
        description: "deposit test"
      });

      await createStatementUseCase.execute({
        user_id: userCreated.id as string,
        type: "withdraw" as any,
        amount: 200,
        description: "withdraw test"
      });

    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });
});
