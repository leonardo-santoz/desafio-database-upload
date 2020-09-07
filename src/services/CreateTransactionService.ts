import { getRepository, getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getRepository(Category);

    const { total } = await transactionsRepository.getBalance();

    if (type === 'outcome' && total < value)
      throw new AppError('Value is bigger than total', 400);

    const transactionTitleExists = await transactionsRepository.findOne({
      where: { title },
    });

    if (transactionTitleExists)
      throw new AppError('Title is already in use.', 400);

    let categoryFromTransaction = await categoryRepository.findOne({
      where: { title: category },
    });

    if (!categoryFromTransaction) {
      categoryFromTransaction = categoryRepository.create({ title: category });
    }

    await categoryRepository.save(categoryFromTransaction);

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category: categoryFromTransaction,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
