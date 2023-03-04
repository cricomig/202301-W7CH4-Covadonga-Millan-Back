import { Router } from 'express';
import { UsersController } from '../controllers/users/users.controller.js';
import { UsersMongoRepo } from '../repository/users/users.mongo.repo.js';
// const debug = createDebug('W6:router:users');

export const usersRouter = Router();
// debug('Loaded');
const repo = UsersMongoRepo.getInstance();
const controller = new UsersController(repo);

usersRouter.get('/', controller.getAll.bind(controller));
usersRouter.post('/register', controller.register.bind(controller));
usersRouter.post('/login', controller.login.bind(controller));
