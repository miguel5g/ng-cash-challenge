export interface Account {
  username: string;
  balance: number;
  transactions: Transaction[];
}

export interface Transaction {
  id: string;
  from: string;
  to: string;
  type: 'credit' | 'debit';
  amount: number;
  createdAt: Date;
}
