import { currencyParser } from '../libs/currency-parser';

interface AccountDetailsProps {
  balance?: number;
  totalTransactions?: number;
}

const AccountDetails: React.FC<AccountDetailsProps> = ({ balance, totalTransactions }) => {
  return (
    <main className="flex w-full max-w-3xl gap-8 mx-auto mt-16">
      <div className="p-8 border border-black shadow-solid-md flex-[2] bg-white">
        {balance ? (
          <span className="text-2xl font-semibold">{currencyParser(balance)}</span>
        ) : (
          <div className="w-64 h-8 bg-gray-300 rounded animate-pulse" />
        )}

        <p className="font-light">Saldo atual</p>
      </div>
      <div className="flex-1 p-8 mr-2 bg-white border border-black shadow-solid-md">
        {totalTransactions ? (
          <span className="text-2xl font-semibold">{totalTransactions}</span>
        ) : (
          <div className="h-8 bg-gray-300 rounded w-28 animate-pulse" />
        )}
        <p className="font-light">Transferências até agora</p>
      </div>
    </main>
  );
};

export { AccountDetails };
