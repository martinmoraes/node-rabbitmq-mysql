require('dotenv').config();
const { UserRepository, userResultFind, userDTOWithID, userDTOWithoutID } = require('./mock_user');
const { UserUpsertService } = require('../user_upsert.service');

describe('UpSertUserService', () => {
  let upsertUserService;

  beforeEach(() => {
    upsertUserService = new UserUpsertService(UserRepository);
    jest.clearAllMocks();
  });

  describe('creating user', () => {
    it('success creating user', async () => {
      const spyFindByEmail = jest.spyOn(UserRepository, 'findByEmail').mockResolvedValue({});
      const spyInsert = jest.spyOn(UserRepository, 'insert').mockResolvedValue({ affectedRows: 1 });
      const spyUpdate = jest.spyOn(UserRepository, 'updateById');

      const result = await upsertUserService.execute(userDTOWithoutID);

      expect(result).toEqual(expect.objectContaining({ affectedRows: 1 }));
      expect(spyFindByEmail).toHaveBeenCalledWith({ email: userDTOWithoutID.email });
      expect(spyInsert).toHaveBeenCalledWith(userDTOWithoutID);
      expect(spyUpdate).not.toHaveBeenCalled();
    });

    it('user already registered', async () => {
      const spyFindByEmail = jest.spyOn(UserRepository, 'findByEmail').mockResolvedValue(userResultFind);
      const spyInser = jest.spyOn(UserRepository, 'insert');
      const spyUpdate = jest.spyOn(UserRepository, 'updateById').mockResolvedValue({ affectedRows: 1 });

      const result = await upsertUserService.execute(userDTOWithoutID);

      expect(result).toEqual(false);
      expect(spyFindByEmail).toHaveBeenCalled();
      expect(spyInser).not.toHaveBeenCalled();
      expect(spyUpdate).not.toHaveBeenCalled();
    });

    it('system error', async () => {
      jest.spyOn(UserRepository, 'findByEmail').mockImplementation(() => {
        throw new Error('Exceção simulada');
      });

      const result = await upsertUserService.execute(userDTOWithoutID);

      expect(result).toEqual(false);
    });
  });

  describe('update user', () => {
    it('success update user', async () => {
      const spyFindByEmail = jest.spyOn(UserRepository, 'findByEmail').mockResolvedValue(userDTOWithID);
      const spyUpdate = jest.spyOn(UserRepository, 'updateById').mockResolvedValue({ affectedRows: 1 });

      const result = await upsertUserService.execute(userDTOWithID);

      expect(result).toEqual(expect.objectContaining({ affectedRows: 1 }));
      expect(spyFindByEmail).toHaveBeenCalledWith({ email: userDTOWithID.email });
      expect(spyUpdate).toHaveBeenCalled();
    });

    it('different id`s', async () => {
      const spyFindByEmail = jest.spyOn(UserRepository, 'findByEmail').mockResolvedValue(userResultFind);
      const spyUpdate = jest.spyOn(UserRepository, 'updateById');

      const result = await upsertUserService.execute(userDTOWithID);

      expect(result).toEqual(false);
      expect(spyFindByEmail).toHaveBeenCalledWith({ email: userResultFind.email });
      expect(spyUpdate).not.toHaveBeenCalled();
    });

    it('system error', async () => {
      jest.spyOn(UserRepository, 'updateById').mockImplementation(() => {
        throw new Error('Exceção simulada');
      });

      const result = await upsertUserService.execute(userDTOWithoutID);

      expect(result).toEqual(false);
    });
  });
});
