require('dotenv').config();
const { UserRepository, userResultFind } = require('./mock_user');
const { UserDeleteService } = require('../user_delete.service');

describe('UpSertUserService', () => {
  let deleteUserService;

  beforeEach(() => {
    deleteUserService = new UserDeleteService(UserRepository);
    jest.clearAllMocks();
  });

  describe('inactive user', () => {
    it('success inactivating user', async () => {
      const spyFindById = jest.spyOn(UserRepository, 'findById').mockResolvedValue(userResultFind);
      const spyInactiveById = jest.spyOn(UserRepository, 'cancelById').mockResolvedValue({ affectedRows: 1 });

      const userId = 4;
      const result = await deleteUserService.execute(userId);

      expect(result).toEqual(expect.objectContaining({ affectedRows: 1 }));
      expect(spyFindById).toHaveBeenCalledWith({ id: 4 });
      expect(spyInactiveById).toHaveBeenCalledWith({ id: userId });
    });

    it('user does not exist', async () => {
      const spyFindById = jest.spyOn(UserRepository, 'findById').mockResolvedValue({});
      const spyInactiveById = jest.spyOn(UserRepository, 'cancelById');

      const userId = 4;
      const result = await deleteUserService.execute(userId);

      expect(result).toEqual(false);
      expect(spyFindById).toHaveBeenCalledWith({ id: 4 });
      expect(spyInactiveById).not.toHaveBeenCalled();
    });

    it('system exception', async () => {
      const spyFindById = jest.spyOn(UserRepository, 'findById').mockImplementation(() => {
        throw new Error('Exceção simulada');
      });
      const spyInactiveById = jest.spyOn(UserRepository, 'cancelById');

      const userId = 4;
      const result = await deleteUserService.execute(userId);

      expect(result).toEqual(false);
      expect(spyFindById).toHaveBeenCalledWith({ id: 4 });
      expect(spyInactiveById).not.toHaveBeenCalled();
    });
  });
});
