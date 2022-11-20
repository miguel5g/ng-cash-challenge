import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';
import { FiLoader, FiLock, FiUser } from 'react-icons/fi';

import { Button } from '../components/button';
import { useAccount } from '../hooks/use-account';
import { notify } from '../libs/notify';

const SignIn: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();
  const { signIn } = useAccount();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isLoading) return;

    if (!username || !password) return notify('Você deve preencher todos os campos.');

    if (username.length < 3) return notify('O nome de usuário deve ter no mínimo 3 caracteres.');

    if (!/((?=.*\d))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*/.test(password))
      return notify('A senha deve conter um número, uma letra maiúscula e uma letra minúscula');

    if (password.length < 8) return notify('A senha deve ter no mínimo 8 caracteres.');

    setLoading(true);

    signIn(username, password)
      .then(({ data }) => {
        switch (data.message) {
          case 'Successfully authenticated':
            notify('Agora você está conectado!');
            router.push('/');
            break;
          case 'Invalid request body':
            notify('Algum dos dados estão inválidos.');
            break;
          case 'User not found':
            notify('Conta não encontrada. Verifique seus dados e tente novamente.');
            break;
          default:
            notify('Algo deu errado, tente novamente mais tarde.');
            break;
        }
      })
      .catch(() => notify('Algo deu errado, tente novamente mais tarde.'))
      .finally(() => setLoading(false));
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-6">
      <Head>
        <title>Acessar conta | NG Cash</title>
      </Head>

      <section className="flex flex-col w-full max-w-xl p-12 bg-white border border-black shadow-solid-lg">
        <h1 className="text-3xl font-bold uppercase text-slate-900">Acessar conta.</h1>

        <form className="flex flex-col gap-4 mt-8" onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <label htmlFor="username" className="flex items-center gap-2 font-light text-slate-900">
              <FiUser />
              <span>Nome de usuário</span>
            </label>
            <input
              id="username"
              className="px-3 border border-black py-1.5 mt-1 shadow-solid-sm"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="username" className="flex items-center gap-2 font-light text-slate-900">
              <FiLock />
              <span>Senha</span>
            </label>
            <input
              id="username"
              className="px-3 border border-black py-1.5 mt-1 shadow-solid-sm"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          <Button className="mt-6" type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <FiLoader className="animate-spin" />
                <span>Carregando...</span>
              </>
            ) : (
              'Acessar conta'
            )}
          </Button>

          <span className="mt-2 font-light text-slate-600">
            Ainda não tem uma conta?{' '}
            <Link className="text-purple-600 underline" href="/sign-up">
              Criar conta
            </Link>
            .
          </span>
        </form>
      </section>
    </div>
  );
};

export default SignIn;
