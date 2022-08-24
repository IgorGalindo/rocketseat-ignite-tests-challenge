import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

describe("Show User Profile", () => {

  let createUserUseCase: CreateUserUseCase;
  let showUserProfileUseCase: ShowUserProfileUseCase;
  let inMemoryUsersRepository: InMemoryUsersRepository;

  const user = {
    name: String(Math.random()),
    email: String(Math.random()),
    password: String(Math.random())
  }

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
  });

  it("should be able to get user profile by ID", async () => {
    const createdUser = await createUserUseCase.execute(user);
    const result = await showUserProfileUseCase.execute(String(createdUser.id));
    expect(result).toMatchObject(createdUser);
  });

  it("should not be able to find a user profile with incorrect ID", async () => {
    expect(async () => {
      await showUserProfileUseCase.execute('00000000-0000-0000-0000-000000000000');
    }).rejects.toBeInstanceOf(AppError);
  });

})
