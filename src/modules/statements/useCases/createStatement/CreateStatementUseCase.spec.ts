import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase";


describe("Create Statement Operation", () => {

  let inMemoryUsersRepository: InMemoryUsersRepository;
  let inMemoryStatementsRepository: InMemoryStatementsRepository;
  let createUserUseCase: CreateUserUseCase;
  let createStatementUseCase: CreateStatementUseCase;

  enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
  }

  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository,
      inMemoryStatementsRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
  });

  it("should be able to make a deposit", async () => {
    const user = {
      name: String(Math.random()),
      email: String(Math.random()),
      password: String(Math.random())
    }

    const createdUser = await createUserUseCase.execute(user);

    const deposit = {
      user_id: String(createdUser.id),
      type: 'deposit' as OperationType,
      amount: 500,
      description: "deposit test"
    }

    const result = await createStatementUseCase.execute(deposit);

    expect({
      user_id: result.user_id,
      type: result.type,
      amount: result.amount,
      description: result.description
    }).toMatchObject(deposit);
  });

  it("should be able to make a withdraw", async () => {
    const user = {
      name: String(Math.random()),
      email: String(Math.random()),
      password: String(Math.random())
    }

    const createdUser = await createUserUseCase.execute(user);

    const deposit = {
      user_id: String(createdUser.id),
      type: 'deposit' as OperationType,
      amount: 500,
      description: "deposit test"
    }
    await createStatementUseCase.execute(deposit);

    const withdraw = {
      user_id: String(createdUser.id),
      type: 'withdraw' as OperationType,
      amount: 450,
      description: "withdraw test"
    }
    const result = await createStatementUseCase.execute(withdraw);

    expect({
      user_id: result.user_id,
      type: result.type,
      amount: result.amount,
      description: result.description
    }).toMatchObject(withdraw);
  });

  it("should not be able to withdraw when there is not enough balance", async () => {
    const user = {
      name: String(Math.random()),
      email: String(Math.random()),
      password: String(Math.random())
    }

    const createdUser = await createUserUseCase.execute(user);

    expect(async () => {
      await createStatementUseCase.execute({
        user_id: String(createdUser.id),
        type: 'withdraw' as OperationType,
        amount: 100.50,
        description: "withdraw test"
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to make a deposit or withdraw for non-existent user", async () => {
    expect(async () => {
      await createStatementUseCase.execute({
        user_id: "00000000-0000-0000-0000-000000000000",
        type: "withdraw" as OperationType,
        amount: 100,
        description: "deposit test"
      });
    }).rejects.toBeInstanceOf(AppError);
  });

})
