import { currencyParser } from '../libs/currency-parser';
import { Transaction } from '../typings';

interface TransactionRowProps {
  transaction: Transaction;
}

const TransactionRow: React.FC<TransactionRowProps> = ({
  transaction: { amount, from, to, type, createdAt },
}) => {
  return (
    <tr>
      <td className="px-3 py-1 border border-black text-start">
        <p className="text-slate-900">{type === 'credit' ? `De @${from}` : `Para @${to}`}</p>
        <span className="text-sm font-light translate-y-4 text-slate-700">
          {new Date(createdAt).toLocaleString('pt-BR')}
        </span>
      </td>
      <td className="px-3 py-1 border border-black text-start">
        {currencyParser(type === 'credit' ? amount : 0 - amount)}
      </td>
    </tr>
  );
};

export { TransactionRow };
