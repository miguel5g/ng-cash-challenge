import { Toaster } from 'react-hot-toast';
import type { AppProps } from 'next/app';

import '../styles/globals.css';
import { AccountProvider } from '../contexts/account-context';

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <AccountProvider>
      <Component {...pageProps} />
      <Toaster position="top-right" reverseOrder />
    </AccountProvider>
  );
};

export default App;
