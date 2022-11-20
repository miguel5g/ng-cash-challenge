import Head from 'next/head';
import { useState } from 'react';
import { FiFilter } from 'react-icons/fi';

import { AccountDetails } from '../components/account-details';
import { Button } from '../components/button';
import { Header } from '../components/header';
import { NewTransactionBox } from '../components/new-transaction-box';
import { TransactionsFilter } from '../components/transactions-filter';
import { TransactionsTable } from '../components/transactions-table';
import { useAccount } from '../hooks/use-account';

const Home: React.FC = () => {
  const [isShowingFilters, setShowingFilters] = useState(false);
  const { account } = useAccount();

  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>Dashboard | NG Cash</title>
      </Head>

      <Header username={account?.username} />

      <AccountDetails balance={account?.balance} totalTransactions={account?.transactions?.length} />

      <section className="flex flex-col-reverse w-full max-w-3xl gap-8 px-6 mx-auto mt-12 mb-16 md:flex-row">
        <div className="flex flex-col flex-1">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Histórico de transferências</h2>
            <Button className="py-1 text-sm" onClick={() => setShowingFilters((state) => !state)}>
              <FiFilter />
            </Button>
          </div>

          {isShowingFilters && (
            <TransactionsFilter />
          )}

          <TransactionsTable transactions={account?.transactions} />
        </div>

        <NewTransactionBox />
      </section>
    </div>
  );
};

export default Home;
