import { Request, Response } from 'express';

import { CreateStatementUseCase } from './CreateStatementUseCase';
import { container } from 'tsyringe';

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer',
}

export class CreateStatementController {
  async execute(request: Request, response: Response) {
    const { id: user_id } = request.user;
    const { amount, description } = request.body;


    const splittedPath = request.originalUrl.split('/')
    let type;
    if (request.params.user_id) {
      type = splittedPath[splittedPath.length - 2] as OperationType;
    } else {
      type = splittedPath[splittedPath.length - 1] as OperationType;
    }
    let executeParams
    if (type === 'transfer') {
      const { user_id: receiver_id } = request.params;
      executeParams = {
        user_id,
        receiver_id,
        type,
        amount,
        description
      };
    } else {
      executeParams = {
        user_id,
        type,
        amount,
        description
      };
    }

    const createStatement = container.resolve(CreateStatementUseCase);

    const statement = await createStatement.execute(executeParams);

    return response.status(201).json(statement);
  }
}
