import "reflect-metadata"

import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe("Create Statement", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
    getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
  });
  it("should be able to get an statement operation of an user", async () => {
    const user: ICreateUserDTO = {
      email: "user@test.com",
      password: "1234",
      name: "user test",
    };

    const userCreated = await createUserUseCase.execute(user);

    const statementCreated = await createStatementUseCase.execute({
      user_id: userCreated.id as string,
      type: "deposit" as any,
      amount: 100,
      description: "deposit test"
    });

    const result = await getStatementOperationUseCase.execute({
      user_id: userCreated.id as string,
      statement_id: statementCreated.id as string,
    });

    expect(result).toHaveProperty("id");
  });

  it("should not be able to get an statement operation of a non existent user", async () => {
    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: "1313131",
        statement_id: "3131",
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it("should not be able to get an statement operation of a non existent statement", async () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        email: "user@test.com",
        password: "1234",
        name: "user test",
      };

      const userCreated = await createUserUseCase.execute(user);

      await getStatementOperationUseCase.execute({
        user_id: userCreated.id as string,
        statement_id: "3131313131",
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
});
