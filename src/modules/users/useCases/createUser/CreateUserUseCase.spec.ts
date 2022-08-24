import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";

describe("Create User", () => {

  let createUserUseCase: CreateUserUseCase;
  let inMemoryUsersRepository: InMemoryUsersRepository;

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to create a new user", async () => {
    const user = {
      name: String(Math.random()),
      email: 'email@email.com',
      password: String(Math.random())
    }

    const response = await createUserUseCase.execute(user);
    expect(response).toHaveProperty("id");
  });

  it("should not be able to create new users when email is already taken", async () => {
    const user = {
      name: String(Math.random()),
      email: 'email@email.com',
      password: String(Math.random())
    }
    await createUserUseCase.execute(user);

    expect(async () => {
      await createUserUseCase.execute(user);
    }).rejects.toBeInstanceOf(AppError);
  });

})
