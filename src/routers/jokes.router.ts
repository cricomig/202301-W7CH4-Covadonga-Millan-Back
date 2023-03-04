import { Router } from 'express';
import { JokesController } from '../controllers/jokes/jokes.controller.js';
import { authentication } from '../interceptors/authentication.js';
import { authorization } from '../interceptors/authorization.js';
import { JokesMongoRepo } from '../repository/jokes/jokes.mongo.repo.js';
import { UsersMongoRepo } from '../repository/users/users.mongo.repo.js';

export const jokesRouter = Router();
const jokesRepo = JokesMongoRepo.getInstance();
const usersRepo = UsersMongoRepo.getInstance();
const controller = new JokesController(jokesRepo, usersRepo);

jokesRouter.get('/', controller.getAll.bind(controller));
jokesRouter.get('/:id', controller.get.bind(controller));
jokesRouter.post('/', authentication, controller.post.bind(controller));
jokesRouter.patch(
  '/:id',
  authentication,
  (req, resp, next) => authorization(req, resp, next, jokesRepo),
  controller.patch.bind(controller)
);
jokesRouter.delete(
  '/:id',
  authentication,
  (req, resp, next) => authorization(req, resp, next, jokesRepo),
  controller.delete.bind(controller)
);
