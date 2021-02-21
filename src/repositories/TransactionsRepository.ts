import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    return this.transactions.reduce<Balance>(
      (accumulator: Balance, transaction: Transaction) => {
        if (transaction.type === 'income') {
          return {
            ...accumulator,
            income: transaction.value + accumulator.income,
            total: transaction.value - accumulator.outcome,
          };
        }

        if (transaction.type === 'outcome') {
          return {
            ...accumulator,
            outcome: transaction.value + accumulator.outcome,
            total: accumulator.income - transaction.value,
          };
        }
        return accumulator;
      },
      {
        income: 0,
        outcome: 0,
        total: 0,
      },
    );
  }

  public create(data: Omit<Transaction, 'id'>): Transaction {
    const { title, type, value } = data;

    const transaction = new Transaction({ title, type, value });

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
