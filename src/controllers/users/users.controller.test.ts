import { Response, Request } from 'express';
import { UsersMongoRepo } from '../../repository/users/users.mongo.repo.js';
//To implement
import { Auth } from '../../helpers/auth.js';
import { UsersController } from './users.controller.js';

describe('Given UsersController', () => {
  const repo: UsersMongoRepo = {
    create: jest.fn(),
    query: jest.fn(),
    search: jest.fn(),
    queryId: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  Auth.hash = jest.fn();
  Auth.compare = jest.fn();
  Auth.createJWT = jest.fn();

  let req = {} as unknown as Request;
  const resp = {
    json: jest.fn(),
    status: jest.fn(),
  } as unknown as Response;
  const next = jest.fn();

  const controller = new UsersController(repo);

  beforeEach(() => {
    req = {
      body: {
        email: 'pepe',
        passwd: 'some',
      },
    } as unknown as Request;
  });

  describe('When register is used', () => {
    test("Then if there's no email or password next should've been called", async () => {
      req.body.email = null;
      await controller.register(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
    // TEMP to implement

    test('Then if all fields are correct it should call resp.json', async () => {
      await controller.register(req, resp, next);

      (Auth.hash as jest.Mock).mockResolvedValue('some');
      expect(repo.create).toHaveBeenCalled();
      expect(resp.status).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });
  });

  describe('When login is called', () => {
    test("Then if there's no email or password next should be called", async () => {
      req.body.passwd = '';
      await controller.login(req, resp, next);
      expect(next).toHaveBeenCalled();
    });

    test("Then if there's password and email it should search for user and return a token", async () => {
      await controller.login(req, resp, next);
      (repo.search as jest.Mock).mockResolvedValue([2]);
      (Auth.compare as jest.Mock).mockResolvedValue(true);
      (Auth.createJWT as jest.Mock).mockResolvedValue('token');
      expect(resp.json).toHaveBeenCalled();
    });

    test("Then if there's a password and email and doesn't find a match it should throw an error", async () => {
      await controller.login(req, resp, next);

      (repo.search as jest.Mock).mockResolvedValue([]);

      expect(next).toHaveBeenCalled();
    });
    test('some3', async () => {
      await controller.login(req, resp, next);
      (repo.search as jest.Mock).mockResolvedValue([true]);
      (Auth.compare as jest.Mock).mockResolvedValue(false);

      expect(next).toHaveBeenCalled();
    });
  });
});
