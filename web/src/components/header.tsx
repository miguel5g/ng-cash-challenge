import Link from 'next/link';

interface HeaderProps {
  username?: string;
}

const Header: React.FC<HeaderProps> = ({ username }) => {
  return (
    <header className="flex items-center justify-center px-6 py-3 bg-white border-b border-black">
      <div className="flex items-center justify-between w-full max-w-3xl">
        <h1 className="text-2xl font-bold text-slate-900">NGCash</h1>

        <div className="flex flex-col items-end">
          {username ? (
            <span className='text-slate-900'>@{username}</span>
          ) : (
            <div className="w-32 h-6 bg-gray-300 rounded animate-pulse" />
          )}
          <Link className="text-sm font-light text-red-500 underline" href="/sign-out">
            Desconectar
          </Link>
        </div>
      </div>
    </header>
  );
};

export { Header };
