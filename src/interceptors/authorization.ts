import { NextFunction, Request, Response } from 'express';
import { Auth, TokenPayload } from '../helpers/auth.js';
import { HTTPError } from '../interfaces/errors.js';
import { JokesMongoRepo } from '../repository/jokes/jokes.mongo.repo.js';
// const debug = createDebug('W6:interceptor:authorization');

export interface RequestCool extends Request {
  info?: TokenPayload;
}

export async function authorization(
  req: RequestCool,
  resp: Response,
  next: NextFunction,
  jokesRepo: JokesMongoRepo
) {
  const authHeader = req.get('Authorization');

  try {
    // debug('Called');
    if (!req.info)
      throw new HTTPError(
        498,
        'Token not found',
        'Token not found in authorization interceptor'
      );
    const userId = req.info.id;
    const jokeId = req.params.id;
    const actualJoke = await jokesRepo.queryId(jokeId); //Devuelve una promesa así que todo async
    if (actualJoke.owner.id !== userId)
      throw new HTTPError(
        401,
        'Not authorized',
        'Not authorized, different id'
      );
    next();
  } catch (error) {
    next(error);
  }
}
