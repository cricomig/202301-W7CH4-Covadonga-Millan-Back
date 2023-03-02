import { JokesModel } from './jokes.mongo.models.js';
import { HTTPError } from '../../interfaces/errors.js';
import { Repo } from '../repository.interface.js';
import createDebug from 'debug';
import { Joke } from '../../entities/jokes.js';

const debug = createDebug('CP:repo');

export class JokesMongoRepo implements Repo<Joke> {
  async query(): Promise<Joke[]> {
    debug('query method');
    const data = await JokesModel.find().populate('owner');
    return data;
  }
  async queryId(id: string): Promise<Joke> {
    debug('queryId method');
    const data = await JokesModel.findById(id);
    if (!data) throw new HTTPError(404, 'Not found', 'Id not found in queryId');
    return data;
  }
  async search(query: { key: string; value: unknown }) {
    debug('search');
    const data = await JokesModel.find({ [query.key]: query.value });
    return data;
  }
  async create(info: Partial<Joke>): Promise<Joke> {
    debug('create method');
    const data = await (await JokesModel.create(info)).populate('owner');
    return data;
  }
  async update(info: Partial<Joke>): Promise<Joke> {
    debug('update method');
    const data = await JokesModel.findByIdAndUpdate(info.id, info, {
      new: true,
    });
    if (!data) throw new HTTPError(404, 'Not found', 'Id not found in update');
    return data;
  }
  async delete(id: string): Promise<void> {
    debug('delete method');
    const data = await JokesModel.findByIdAndDelete(id);
    if (!data) throw new HTTPError(404, 'Delete not found', 'Id not possible');
  }
}
