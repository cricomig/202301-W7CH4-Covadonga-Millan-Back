import { Router } from 'express';
import { JokesController } from '../controllers/jokes/jokes.controller.js';
import { authentication } from '../interceptors/authentication.js';
import { authorization } from '../interceptors/authorization.js';
import { JokesMongoRepo } from '../repository/jokes/jokes.mongo.repo.js';
import { UsersMongoRepo } from '../repository/users/users.mongo.repo.js';

export const jokesRouter = Router();
const jokesRepo = new JokesMongoRepo();
const usersRepo = new UsersMongoRepo();
const controller = new JokesController(jokesRepo, usersRepo);

jokesRouter.get('/', authentication, controller.getAll.bind(controller));
jokesRouter.get('/:id', authentication, controller.get.bind(controller));
jokesRouter.post('/', authentication, controller.post.bind(controller));
jokesRouter.patch(
  '/:id',
  authentication,
  authorization,
  controller.patch.bind(controller)
);
jokesRouter.delete(
  '/:id',
  authentication,
  authorization,
  controller.delete.bind(controller)
);
