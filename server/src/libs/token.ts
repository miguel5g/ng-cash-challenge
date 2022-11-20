import jwt from 'jsonwebtoken';

interface TokenPayload {
  id: string;
  accountId: string;
  username: string;
}

function decode(token: string): TokenPayload {
  const { SECRET } = process.env;

  if (!SECRET) throw new Error('Secret must be defined');

  return jwt.verify(token, SECRET) as any;
}

function encode(payload: TokenPayload): string {
  const { SECRET } = process.env;

  if (!SECRET) throw new Error('Secret must be defined');

  if (!payload) throw new Error('Payload is required');

  return jwt.sign(payload, SECRET, { expiresIn: '1d' });
}

export { decode, encode };
