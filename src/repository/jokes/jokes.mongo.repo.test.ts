import { JokesModel } from './jokes.mongo.models';
import { JokesMongoRepo } from './jokes.mongo.repo';

jest.mock('./jokes.mongo.models.js');

describe('Given JokeMongoRepo', () => {
  const repo = new JokesMongoRepo();
  describe('When is called', () => {
    test('Then should be instanced', () => {
      expect(repo).toBeInstanceOf(JokesMongoRepo);
    });
  });

  describe('When query is called', () => {
    test('Then should return the data', async () => {
      (JokesModel.find as jest.Mock).mockResolvedValue([]);
      const result = await repo.query();

      expect(JokesModel.find).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('When queryId is called', () => {
    test('Then if it has a valid id it should return the data', async () => {
      (JokesModel.findById as jest.Mock).mockResolvedValue({ id: '1' });

      const id = '1';
      const result = await repo.queryId(id);
      expect(JokesModel.findById).toHaveBeenCalled();
      expect(result).toEqual({ id: '1' });
    });
    test("Then if id doesn't exists it should throw an error", () => {
      (JokesModel.findById as jest.Mock).mockResolvedValue(undefined);

      const id = '1';

      expect(async () => repo.queryId(id)).rejects.toThrow();
      expect(JokesModel.findById).toHaveBeenCalled();
    });
  });

  describe('When search is called', () => {
    test('Then it should do a query', async () => {
      const query = { key: 'some', value: 'otro' };

      (JokesModel.find as jest.Mock).mockResolvedValue([query]);
      const result = await repo.search({ key: 'some', value: 'otro' });

      expect(JokesModel.find).toHaveBeenCalled();
      expect(result).toEqual([query]);
    });
  });

  describe('When create is called', () => {
    test('Then it should return an object if we give a valid id', async () => {
      (JokesModel.create as jest.Mock).mockResolvedValue({
        joke: ' some',
        isFunny: true,
        alreadyKnewIt: false,
      });
      const newJoke = {
        joke: ' some',
        isFunny: true,
        alreadyKnewIt: false,
      };
      const result = await repo.create(newJoke);
      expect(result).toStrictEqual(newJoke);
    });
  });

  describe('When update is called', () => {
    test('Then it should return the updated object if it has the same id', async () => {
      (JokesModel.findByIdAndUpdate as jest.Mock).mockResolvedValue({
        joke: ' some',
        isFunny: true,
        alreadyKnewIt: false,
      });
      const result = await repo.update({
        joke: ' some',
        isFunny: true,
        alreadyKnewIt: false,
      });
      expect(JokesModel.findByIdAndUpdate).toHaveBeenCalled();
      expect(result).toEqual({
        joke: ' some',
        isFunny: true,
        alreadyKnewIt: false,
      });
    });
    describe('When the update is rejected', () => {
      test('Then it should throw an error', async () => {
        (JokesModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(
          undefined
        );
        const mockJoke = { id: '1', joke: 'jeje' };
        expect(async () => repo.update(mockJoke)).rejects.toThrow();
        expect(JokesModel.findByIdAndUpdate).toHaveBeenCalled();
      });
    });

    describe('When delete is called', () => {
      test('Then given an id it should delete an entry', async () => {
        (JokesModel.findByIdAndDelete as jest.Mock).mockResolvedValue(
          '[{"id": "1"}]'
        );
        const id = '1';
        const result = await repo.delete(id);
        expect(JokesModel.findByIdAndDelete).toHaveBeenCalled();
        expect(result).toBeUndefined();
      });
      test('Then given an incorrect id it should throw an id', () => {
        (JokesModel.findByIdAndDelete as jest.Mock).mockResolvedValue(
          undefined
        );

        expect(async () => repo.delete('1')).rejects.toThrow();
        expect(JokesModel.findByIdAndDelete).toHaveBeenCalled();
      });
    });
  });
});
