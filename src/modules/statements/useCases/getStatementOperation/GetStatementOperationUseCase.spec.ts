import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";


describe("Get Statement Operation", () => {

  let inMemoryUsersRepository: InMemoryUsersRepository;
  let inMemoryStatementsRepository: InMemoryStatementsRepository;
  let createUserUseCase: CreateUserUseCase;
  let createStatementUseCase: CreateStatementUseCase;
  let getStatementOperationUseCase: GetStatementOperationUseCase;

  enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
  }

  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository,
      inMemoryStatementsRepository);
    getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository,
      inMemoryStatementsRepository)
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
  });

  it("should be able to get a operation by ID", async () => {
    const user = {
      name: String(Math.random()),
      email: String(Math.random()),
      password: String(Math.random())
    }

    const createdUser = await createUserUseCase.execute(user);

    const deposit = {
      user_id: String(createdUser.id),
      type: 'deposit' as OperationType,
      amount: 5200,
      description: "deposit test"
    }

    const depositResult = await createStatementUseCase.execute(deposit);

    const result = await getStatementOperationUseCase.execute({
      user_id: String(createdUser.id),
      statement_id: String(depositResult.id)
    })

    expect(result).toMatchObject(depositResult);
  });

})
