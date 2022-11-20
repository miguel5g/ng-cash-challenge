import clsx from 'clsx';
import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, className, type, ...rest }) => {
  return (
    <button
      type={type || 'button'}
      className={clsx(
        'flex items-center justify-center gap-2 text-white border border-black bg-purple-600 transition-colors hover:bg-purple-700 font-semibold px-3 py-1.5 relative shadow-solid-sm disabled:opacity-75 disabled:cursor-not-allowed',
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
};

export { Button };
