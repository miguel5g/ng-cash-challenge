import bcrypt from 'bcrypt';

async function compareText(hash: string, text: string): Promise<boolean> {
  if (!hash || typeof hash !== 'string') throw new Error('Invalid hash value');

  if (!text || typeof text !== 'string') throw new Error('Invalid text value');

  return bcrypt.compare(text, hash);
}

async function hashText(text: string): Promise<string> {
  if (!text || typeof text !== 'string') throw new Error('Invalid text value');

  const { SALT_ROUNDS } = process.env;

  const saltRounds = SALT_ROUNDS && +SALT_ROUNDS;

  if (!saltRounds) throw new Error('Invalid salt rounds');

  return bcrypt.hash(text, saltRounds);
}

export { compareText, hashText };
