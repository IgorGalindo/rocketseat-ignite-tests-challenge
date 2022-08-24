import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceUseCase } from "./GetBalanceUseCase";


describe("Get Balance", () => {

  let inMemoryUsersRepository: InMemoryUsersRepository;
  let inMemoryStatementsRepository: InMemoryStatementsRepository;
  let createUserUseCase: CreateUserUseCase;
  let createStatementUseCase: CreateStatementUseCase;
  let getBalanceUseCase: GetBalanceUseCase;

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
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository,
      inMemoryUsersRepository)
  });

  it("should be able to get the balance", async () => {
    const user = {
      name: String(Math.random()),
      email: String(Math.random()),
      password: String(Math.random())
    }

    const createdUser = await createUserUseCase.execute(user);

    const deposit = await createStatementUseCase.execute({
      user_id: String(createdUser.id),
      type: 'deposit' as OperationType,
      amount: 5000,
      description: "deposit test"
    });

    const withdraw = await createStatementUseCase.execute({
      user_id: String(createdUser.id),
      type: 'withdraw' as OperationType,
      amount: 450,
      description: "withdraw test"
    });

    const withdraw2 = await createStatementUseCase.execute({
      user_id: String(createdUser.id),
      type: 'withdraw' as OperationType,
      amount: 500,
      description: "withdraw test"
    });

    const result = await getBalanceUseCase.execute({
      user_id: String(createdUser.id)
    });

    expect(result.statement).toEqual(
      expect.arrayContaining([deposit, withdraw, withdraw2])
    );

    expect(result.balance).toEqual(4050);
  });

})
