import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    const incomeValues = transactions
      .filter(transaction => transaction.type === 'income')
      .map(transaction => transaction.value)
      .reduce((acc: number, value) => acc + Number(value), 0);

    const outcomeValues = transactions
      .filter(transaction => transaction.type === 'outcome')
      .map(transaction => transaction.value)
      .reduce((acc: number, value) => acc + Number(value), 0);

    const totalValue = incomeValues - outcomeValues;

    const balance = {
      income: incomeValues,
      outcome: outcomeValues,
      total: totalValue,
    };

    return balance;
  }
}

export default TransactionsRepository;
