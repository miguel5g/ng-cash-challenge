import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';

import { decode, encode } from './token';
import { ONE_DAY_IN_MS } from '../tests/helpers/constants';

describe('libs/token', () => {
  const systemTime = new Date(2022, 9, 29, 12);

  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(systemTime);
    process.env.SECRET = 'super-secret';
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('decode', () => {
    it('should be a function', () => {
      expect(encode).toBeInstanceOf(Function);
    });

    it('should throw an error if secret is not defined', () => {
      delete process.env.SECRET;

      expect(() => decode(undefined as any)).toThrow('Secret must be defined');
    });

    it('should return token payload', () => {
      const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;
      const input = jwt.sign({ hello: 'World' }, process.env.SECRET!, { expiresIn: '1d' });
      const output = decode(input);

      expect(output).toEqual({
        hello: 'World',
        iat: Date.now() / 1000,
        exp: (Date.now() + ONE_DAY_IN_MS) / 1000,
      });
    });

    it('should throw token expired error when token is expired', () => {
      const input = jwt.sign({ hello: 'World' }, process.env.SECRET!, { expiresIn: '1d' });

      jest.setSystemTime(new Date(systemTime.getTime() + ONE_DAY_IN_MS));

      expect(() => decode(input)).toThrowError(TokenExpiredError);
    });

    it('should throw jwt error when token is malformed', () => {
      try {
        decode('invalid');
      } catch (error) {
        expect(error).toBeInstanceOf(JsonWebTokenError);
        expect((error as any).message).toBe('jwt malformed');
      }
    });

    it('should throw jwt error when token is malformed', () => {
      try {
        decode('other.invalid.token');
      } catch (error) {
        expect(error).toBeInstanceOf(JsonWebTokenError);
        expect((error as any).message).toBe('invalid token');
      }
    });
  });

  describe('encode', () => {
    it('should be a function', () => {
      expect(encode).toBeInstanceOf(Function);
    });

    it('should throw an error if secret is not defined', () => {
      delete process.env.SECRET;

      expect(() => encode(undefined as any)).toThrow('Secret must be defined');
    });

    it('should throw an error if payload is not passed', () => {
      process.env.SECRET = undefined;

      expect(() => encode(undefined as any)).toThrow('Payload is required');
    });

    it('should returns an string token string', () => {
      process.env.SECRET = 'super-secret';

      const input = {};
      const output = encode(input as any);

      expect(typeof output).toBe('string');
      expect(output.split('.')).toHaveLength(3);
    });

    it('should have input payload inside token', () => {
      process.env.SECRET = 'super-secret';

      const input = { hello: 'World' };
      const output = encode(input as any);

      const payload = jwt.decode(output);

      expect(payload).toEqual({
        hello: 'World',
        iat: Date.now() / 1000,
        exp: (Date.now() + ONE_DAY_IN_MS) / 1000,
      });
    });
  });
});
