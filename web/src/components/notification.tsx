import clsx from 'clsx';

interface NotificationProps {
  isVisible: boolean;
  message: string;
}

const Notification: React.FC<NotificationProps> = ({ isVisible, message }) => {
  return (
    <div
      className={clsx(
        'px-3 py-1.5 max-w-md w-full bg-white shadow-solid-sm pointer-events-auto border border-black',
        isVisible ? 'animate-enter' : 'animate-leave'
      )}
    >
      {message}
    </div>
  );
};

export { Notification };
