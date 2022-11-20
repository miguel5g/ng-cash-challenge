import { Transaction } from '../typings';
import { TransactionRow } from './transaction-row';

interface TransactionsTableProps {
  transactions?: Transaction[];
}

const TransactionsTable: React.FC<TransactionsTableProps> = ({ transactions }) => {
  return (
    <table className="mt-6 bg-white border border-black shadow-solid-md">
      <thead>
        <tr>
          <th className="px-3 py-2 font-normal border border-black text-slate-900 text-start">
            Detalhes
          </th>
          <th className="px-3 py-2 font-normal border border-black text-slate-900 text-start">
            Valor
          </th>
        </tr>
      </thead>
      <tbody>
        {transactions &&
          transactions.map((transaction) => (
            <TransactionRow key={transaction.id} transaction={transaction} />
          ))}
      </tbody>
    </table>
  );
};

export { TransactionsTable };
