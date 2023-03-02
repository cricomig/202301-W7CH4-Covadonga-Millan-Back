import jwt, { JwtPayload } from 'jsonwebtoken';
import { config } from '../config.js';
import bcrypt from 'bcryptjs';
import { HTTPError } from '../interfaces/errors.js';

export interface TokenPayload extends JwtPayload {
  id: string;
  email: string;
  role: string;
}

const salt = 10;

export class Auth {
  static createJWT(payload: TokenPayload) {
    return jwt.sign(payload, config.jwtsecret as string);
  }

  static verifyJWT(token: string): TokenPayload {
    const result = jwt.verify(token, config.jwtsecret as string);

    if (typeof result === 'string')
      throw new HTTPError(498, 'Invalid token', result);

    return result as TokenPayload;
  }

  static hash(value: string) {
    return bcrypt.hash(value, salt);
  }

  static compare(value: string, hash: string) {
    return bcrypt.compare(value, hash);
  }
}
