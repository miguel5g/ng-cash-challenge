import React, { useState } from 'react';
import { useAccount } from '../hooks/use-account';
import { Button } from './button';

const TransactionsFilter: React.FC = () => {
  const [type, setType] = useState<'all' | 'credit' | 'debit'>('all');
  const [createdAt, setCreatedAt] = useState('');
  const { filterBy } = useAccount();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    filterBy({ type, createdAt });
  }

  return (
    <form className="flex gap-2 mt-4" onSubmit={handleSubmit}>
      <select
        className="text-white border border-black bg-purple-600 transition-colors hover:bg-purple-700 font-semibold px-3 py-1.5 shadow-solid-sm disabled:opacity-75 disabled:cursor-not-allowed"
        value={type}
        onChange={(event) => setType(event.target.value as any)}
      >
        <option value="all">Todos</option>
        <option value="credit">Crédito</option>
        <option value="debit">Débito</option>
      </select>

      <input
        type="date"
        className="text-white border border-black bg-purple-600 transition-colors hover:bg-purple-700 font-semibold px-3 py-1.5 shadow-solid-sm disabled:opacity-75 disabled:cursor-not-allowed"
        value={createdAt}
        onChange={(event) => setCreatedAt(event.target.value)}
      />

      <Button type="submit" className="ml-auto">
        Filtrar
      </Button>
    </form>
  );
};

export { TransactionsFilter };
