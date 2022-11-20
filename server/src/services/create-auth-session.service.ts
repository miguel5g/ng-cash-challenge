import { NotFoundError, UnauthorizedError } from '../errors';
import { compareText } from '../libs/encryption';
import { prisma } from '../libs/prisma';
import { encode } from '../libs/token';

interface Credentials {
  username: string;
  password: string;
}

class CreateAuthSessionService {
  async handler({ username, password }: Credentials) {
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        password: true,
        username: true,
        account: { select: { id: true } },
      },
    });

    if (!user) throw new NotFoundError('User');

    const isValid = await compareText(user.password, password);

    if (!isValid) throw new UnauthorizedError('Passwords do not match');

    return encode({ id: user.id, username: user.username, accountId: user.account.id });
  }
}

export { CreateAuthSessionService };
