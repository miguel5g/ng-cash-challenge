import { Account, Transaction } from '../typings';

interface ApiProps extends RequestInit {
  body?: any;
}

async function api<T = unknown>(
  path: string,
  { body, headers, ...init }: ApiProps = {}
): Promise<{ data: T; status: number }> {
  const BASE_API_URL = process.env.NEXT_PUBLIC_BASE_API_URL;

  if (!BASE_API_URL) throw new Error('Invalid base api url');

  const response = await fetch(`${BASE_API_URL}${path}`, {
    ...init,
    mode: 'cors',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(headers || {}) },
    body: body && JSON.stringify(body),
  });

  return {
    data: await response.json(),
    status: response.status,
  };
}

async function getUser() {
  return api<Account>('/users/me').then(({ data, status }) => {
    if (status === 200) return data;
    return null;
  });
}

async function getTransactions() {
  return api<{ transactions: Transaction[] }>('/transactions').then(({ data, status }) => {
    if (status === 200) return data.transactions;
    return null;
  });
}

async function getBalance() {
  return api<{ balance: number }>('/account/balance').then(({ data, status }) => {
    if (status === 200) return data.balance;
    return null;
  });
}

export { api, getBalance, getTransactions, getUser };
