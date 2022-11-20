import React, { memo, useState } from 'react';
import { FiDollarSign, FiLoader, FiUser } from 'react-icons/fi';

import { useAccount } from '../hooks/use-account';
import { notify } from '../libs/notify';

import { Button } from './button';

const NewTransactionBox: React.FC = () => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const { createTransaction } = useAccount();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isLoading) return;

    if (!recipient || amount === undefined) return notify('Você deve preencher todos os campos.');

    if (recipient.length < 3) return notify('O nome de usuário deve ter no mínimo 3 caracteres.');

    if (amount < 1) return notify('A valor mínimo é R$ 1,00.');

    setLoading(true);

    createTransaction(recipient, amount)
      .then((message: string) => {
        notify(message);
        setRecipient('');
        setAmount(0);
      })
      .catch(() => notify('Algo deu errado, tente novamente mais tarde.'))
      .finally(() => setLoading(false));
  }

  return (
    <div className="w-full max-w-xs p-8 mr-2 bg-white border border-black shadow-solid-md h-max">
      <h2 className="text-lg font-semibold">Transferir para outra pessoa</h2>

      <form className="flex flex-col mt-4" onSubmit={handleSubmit}>
        <div className="flex flex-col">
          <label htmlFor="username" className="flex items-center gap-2 font-light text-slate-900">
            <FiUser />
            <span>Nome de usuário</span>
          </label>
          <input
            id="username"
            className="px-3 border border-black py-1.5 mt-1 shadow-solid-sm"
            type="text"
            value={recipient}
            onChange={(event) => setRecipient(event.target.value)}
          />
        </div>

        <div className="flex flex-col mt-4">
          <label htmlFor="amount" className="flex items-center gap-2 font-light text-slate-900">
            <FiDollarSign />
            <span>Valor da transferência</span>
          </label>
          <input
            id="amount"
            className="px-3 border border-black py-1.5 mt-1 shadow-solid-sm"
            type="number"
            value={amount}
            onChange={(event) => setAmount(+event.target.value)}
          />
        </div>

        <Button className="mt-8" type="submit">
          {isLoading ? (
            <>
              <FiLoader className="animate-spin" />
              <span>Carregando...</span>
            </>
          ) : (
            'Transferir'
          )}
        </Button>
      </form>
    </div>
  );
};

const MemoNewTransactionBox = memo(NewTransactionBox);

export { MemoNewTransactionBox as NewTransactionBox };
