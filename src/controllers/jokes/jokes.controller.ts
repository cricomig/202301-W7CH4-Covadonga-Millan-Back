import { Request, Response, NextFunction } from 'express';
import createDebug from 'debug';
import { Joke } from '../../entities/jokes.js';
import { Repo } from '../../repository/repository.interface.js';
import { RequestCool } from '../../interceptors/authentication.js';
import { User } from '../../entities/user.js';
import { HTTPError } from '../../interfaces/errors.js';

const debug = createDebug('CP:controller');

export class JokesController {
  constructor(public repo: Repo<Joke>, public usersRepo: Repo<User>) {
    debug('Instantiated');
  }
  async getAll(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('getAll method');
      const data = await this.repo.query();
      resp.json({
        results: [data],
      });
    } catch (error) {
      next(error);
    }
  }
  async get(req: Request, resp: Response, next: NextFunction) {
    const id = req.params.id;
    try {
      debug('get method');
      const data = await this.repo.queryId(id);
      resp.json({
        results: [data],
      });
    } catch (error) {
      next(error);
    }
  }
  async post(req: RequestCool, resp: Response, next: NextFunction) {
    try {
      debug('post method');
      // Add car owner
      const userId = req.info?.id;

      if (!userId) throw new HTTPError(404, 'Not found', 'User id not found');

      const user = await this.usersRepo.queryId(userId);
      req.body.owner = userId;

      const data = await this.repo.create(req.body);

      user.jokes.push(data);
      this.usersRepo.update(user);

      resp.json({
        results: [data],
      });
    } catch (error) {
      next(error);
    }
  }
  async patch(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('patch method');
      const data = await this.repo.update(req.body);
      resp.json({
        results: [data],
      });
    } catch (error) {
      next(error);
    }
  }
  async delete(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('delete');
      const id = req.params.id;
      const data = await this.repo.delete(id);
      resp.json({
        results: [data],
      });
    } catch (error) {
      next(error);
    }
  }
}
