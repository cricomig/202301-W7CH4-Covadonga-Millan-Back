import createDebugger from 'debug';
import { NextFunction, Request, Response } from 'express';
import { User } from '../../entities/user';
import { Auth, TokenPayload } from '../../helpers/auth.js';
import { HTTPError } from '../../interfaces/errors.js';
import { Repo } from '../../repository/repository.interface';

const debug = createDebugger('W6: controller');

export class UsersController {
  constructor(public repo: Repo<User>) {
    this.repo = repo;
    debug('Instantiate');
  }

  async register(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('register');
      if (!req.body.email || !req.body.passwd)
        throw new HTTPError(403, 'Unauthorized', 'Invalid email or passwd');
      req.body.passwd = await Auth.hash(req.body.passwd);
      req.body.cars = [];
      const data = await this.repo.create(req.body);
      resp.status(201);
      resp.json({
        results: [data],
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('login:post');
      if (!req.body.email || !req.body.passwd)
        throw new HTTPError(403, 'Unauthorized', 'Invalid email or passwd');

      const data = await this.repo.search({
        key: 'email',
        value: req.body.email,
      });

      if (!data.length)
        throw new HTTPError(401, 'Unauthorized', 'Email not found');

      if (!(await Auth.compare(req.body.passwd, data[0].passwd)))
        throw new HTTPError(401, 'Unauthorized', "Password doesn't match");

      const payload: TokenPayload = {
        email: req.body.email,
        role: 'admin',
        id: data[0].id,
      };

      const token = Auth.createJWT(payload);
      resp.json({
        results: {
          token,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
