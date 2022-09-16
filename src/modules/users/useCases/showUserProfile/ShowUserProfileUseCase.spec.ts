import "reflect-metadata"

import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Show User Profile", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
  });
  it("should be able to show an user", async () => {
    const user: ICreateUserDTO = {
      email: "user@test.com",
      password: "1234",
      name: "user test",
    };

    const userCreated = await createUserUseCase.execute(user);

    const userFetched = await showUserProfileUseCase.execute(userCreated.id as string);

    expect(userFetched).toHaveProperty("id");
  });

  it("should not be able to show an non existent user", async () => {
    expect(async () => {
      await showUserProfileUseCase.execute("non-existent-user-id");
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});
