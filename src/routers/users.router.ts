import { Router } from 'express';
import { UsersController } from '../controllers/users/users.controller.js';
import { UsersMongoRepo } from '../repository/users/users.mongo.repo.js';

export const usersRouter = Router();
const repo = new UsersMongoRepo();
const controller = new UsersController(repo);

usersRouter.post('/register', controller.register.bind(controller));
usersRouter.post('/login', controller.login.bind(controller));
