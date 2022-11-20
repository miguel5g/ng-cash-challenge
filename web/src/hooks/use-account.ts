import { useContext } from 'react';

import { accountContext } from '../contexts/account-context';

function useAccount() {
  return useContext(accountContext);
}

export { useAccount };
