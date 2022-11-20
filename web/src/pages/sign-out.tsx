import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { useAccount } from '../hooks/use-account';
import { notify } from '../libs/notify';

const SignOut: React.FC = () => {
  const router = useRouter();
  const { signOut } = useAccount();

  useEffect(() => {
    signOut().finally(() => {
      notify('Desconectado com sucesso.');
      router.push('/sign-in');
    });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <Head>
        <title>Desconectar | NG Cash</title>
      </Head>

      <h1 className="text-4xl font-bold text-slate-900">Só um instante...</h1>
      <p className="font-light text-slate-600">
        Estamos te desconectando e você será redirecionado para página de acesso.
      </p>
    </div>
  );
};

export default SignOut;
