import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';

import { api, getBalance, getTransactions, getUser } from '../libs/api';
import { Account, Transaction } from '../typings';

interface AccountContextType {
  account: Account | null;
  createTransaction: (to: string, amount: number) => Promise<string>;
  filterBy: (filters: FiltersType) => void;
  signIn: (username: string, password: string) => Promise<{ data: { message: string } }>;
  signOut: () => Promise<void>;
}

interface FiltersType {
  type?: 'all' | 'credit' | 'debit';
  createdAt?: string;
}

const accountContext = createContext({} as AccountContextType);

const AccountProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<Account | null>(null);
  const [filters, setFilters] = useState<FiltersType | null>(null);

  useEffect(() => {
    getUser().then(setAccount);
  }, []);

  function filterBy({ type, createdAt }: FiltersType) {
    if (type === 'all' && !createdAt) return setFilters(null);

    setFilters({ type, createdAt });
  }

  async function createTransaction(to: string, amount: number): Promise<string> {
    async function refreshAccount() {
      const [transactions, balance] = await Promise.all([getTransactions(), getBalance()]);

      if (!transactions || !balance) return;

      setAccount(
        (state) =>
          state && {
            ...state,
            balance,
            transactions,
          }
      );
    }

    return api<{ message: string }>('/transactions', { method: 'POST', body: { to, amount } })
      .then(async ({ data }) => {
        switch (data.message) {
          case `${account?.username} doesn't have enough to send ${amount}`:
            return 'Você não tem dinheiro suficiente para isso.';
          case 'Recipient not found':
            return 'Usuário não encontrado.';
          case "Can't send to yourself":
            return 'Você não pode transferir para si mesmo.';
          case 'Transaction successfully created':
            await refreshAccount();
            return 'Transferência enviada.';
          default:
            return 'Algo deu errado, tente novamente mais tarde.';
        }
      })
      .catch(() => 'Algo deu errado, tente novamente mais tarde.');
  }

  async function signIn(username: string, password: string) {
    return api<{ message: string }>('/auth', {
      method: 'POST',
      body: { username, password },
    }).finally(() => getUser().then(setAccount));
  }

  async function signOut() {
    await api('/auth', { method: 'DELETE' }).then(() => {
      setAccount(null);
      setFilters(null);
    });
  }

  const filteredTransactions = useMemo(() => {
    if (!account) return null;

    const { transactions } = account;

    if (!filters) return transactions;

    return transactions
      .filter((transaction) => (filters.type !== 'all' ? filters.type === transaction.type : true))
      .filter((transaction) => {
        if (!filters.createdAt) return true;

        const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;
        const TIMEZONE_OFFSET_IN_MS = new Date().getTimezoneOffset() * 60 * 1000;
        const transactionDate = new Date(transaction.createdAt).getTime() - TIMEZONE_OFFSET_IN_MS;
        const filterDateStart = new Date(filters.createdAt).getTime();
        const filterDateEnd = new Date(filterDateStart + ONE_DAY_IN_MS).getTime();

        if (transactionDate >= filterDateStart && transactionDate < filterDateEnd) {
          return true;
        }

        return false;
      });
  }, [filters, account]);

  return (
    <accountContext.Provider
      value={{
        account: account && { ...account, transactions: filteredTransactions as Transaction[] },
        createTransaction,
        filterBy,
        signIn,
        signOut,
      }}
    >
      {children}
    </accountContext.Provider>
  );
};

export { accountContext, AccountProvider };
