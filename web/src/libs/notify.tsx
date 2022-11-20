import { toast } from 'react-hot-toast';

import { Notification } from '../components/notification';

function notify(message: string) {
  toast.custom(({ visible }) => <Notification isVisible={visible} message={message} />);
}

export { notify };
