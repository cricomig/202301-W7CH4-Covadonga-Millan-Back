import { User } from '../../entities/user.js';
import { HTTPError } from '../../interfaces/errors.js';
import { Repo } from '../repository.interface.js';
import { UserModel } from './users.mongo.model.js';
import createDebug from 'debug';
const debug = createDebug('W6:repo');

export class UsersMongoRepo implements Repo<User> {
  async query(): Promise<User[]> {
    debug('query');
    return [];
  }
  async queryId(id: string): Promise<User> {
    debug('queryId');
    const data = await UserModel.findById(id);
    if (!data) throw new HTTPError(404, 'Not found', 'Id not found in queryId');
    return data;
  }

  async search(query: { key: string; value: unknown }) {
    debug('search');
    const data = await UserModel.find({ [query.key]: query.value });
    return data;
  }

  async create(info: Partial<User>): Promise<User> {
    debug('create');
    const data = await UserModel.create(info);
    return data;
  }
  async update(info: Partial<User>): Promise<User> {
    debug('update');
    const data = await UserModel.findByIdAndUpdate(info.id, info, {
      new: true,
    });
    if (!data) throw new HTTPError(404, 'Not found', 'Id not found in update');
    return data;
  }
  async delete(id: string): Promise<void> {
    debug('delete');
    const data = await UserModel.findByIdAndDelete(id);
    if (!data) throw new HTTPError(404, 'Delete not found', 'Id not possible');
  }
}
