import { UserModel } from './users.mongo.model';
import { UsersMongoRepo } from './users.mongo.repo';

jest.mock('./users.mongo.model');

describe('Given JokeMongoRepo', () => {
  const repo = new UsersMongoRepo();
  describe('When is called', () => {
    test('Then should be instanced', () => {
      expect(repo).toBeInstanceOf(UsersMongoRepo);
    });
  });

  describe('When query is called', () => {
    test('Then should return the data', async () => {
      // (UserModel.find as jest.Mock).mockResolvedValue([]);
      const result = await repo.query();

      expect(result).toEqual([]);
    });
  });

  describe('When queryId is called', () => {
    test('Then if it has a valid id it should return the data', async () => {
      (UserModel.findById as jest.Mock).mockResolvedValue({ id: '1' });

      const id = '1';
      const result = await repo.queryId(id);
      expect(UserModel.findById).toHaveBeenCalled();
      expect(result).toEqual({ id: '1' });
    });
    test("Then if id doesn't exists it should throw an error", () => {
      (UserModel.findById as jest.Mock).mockResolvedValue(undefined);

      const id = '1';

      expect(async () => repo.queryId(id)).rejects.toThrow();
      expect(UserModel.findById).toHaveBeenCalled();
    });
  });

  describe('When search is called', () => {
    test('Then it should do a query', async () => {
      const query = { key: 'some', value: 'otro' };

      (UserModel.find as jest.Mock).mockResolvedValue([query]);
      const result = await repo.search({ key: 'some', value: 'otro' });

      expect(UserModel.find).toHaveBeenCalled();
      expect(result).toEqual([query]);
    });
  });

  describe('When create is called', () => {
    test('Then it should return an object if we give a valid id', async () => {
      (UserModel.create as jest.Mock).mockResolvedValue({
        email: ' some',
      });
      const newUser = {
        email: ' some',
      };
      const result = await repo.create(newUser);
      expect(result).toStrictEqual(newUser);
    });
  });

  describe('When update is called', () => {
    test('Then it should return the updated object if it has the same id', async () => {
      (UserModel.findByIdAndUpdate as jest.Mock).mockResolvedValue({
        id: '1',
        email: 'pepe',
      });
      const result = await repo.update({
        id: '1',
        email: 'Albert',
      });
      expect(UserModel.findByIdAndUpdate).toHaveBeenCalled();
      expect(result).toEqual({
        id: '1',
        email: 'pepe',
      });
    });
    describe('When the update is rejected', () => {
      test('Then it should throw an error', async () => {
        (UserModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(undefined);
        const mockUser = { id: '1', email: 'jajajeje' };
        expect(async () => repo.update(mockUser)).rejects.toThrow();
        expect(UserModel.findByIdAndUpdate).toHaveBeenCalled();
      });
    });

    describe('When delete is called', () => {
      test('Then given an id it should delete an entry', async () => {
        (UserModel.findByIdAndDelete as jest.Mock).mockResolvedValue(
          '[{"id": "1"}]'
        );
        const id = '1';
        const result = await repo.delete(id);
        expect(UserModel.findByIdAndDelete).toHaveBeenCalled();
        expect(result).toBeUndefined();
      });
      test('Then given an incorrect id it should throw an id', () => {
        (UserModel.findByIdAndDelete as jest.Mock).mockResolvedValue(undefined);

        expect(async () => repo.delete('1')).rejects.toThrow();
        expect(UserModel.findByIdAndDelete).toHaveBeenCalled();
      });
    });
  });
});
