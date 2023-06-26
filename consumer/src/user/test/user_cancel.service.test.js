require('dotenv').config();
const { UserRepository, userResultFind } = require('./mock_user');
const { UserCancelService } = require('../user_cancel.service');

describe('UpSertUserService', () => {
  let deleteUserService;

  beforeEach(() => {
    deleteUserService = new UserCancelService(UserRepository);
    jest.clearAllMocks();
  });

  describe('inactive user', () => {
    it('success inactivating user', async () => {
      const spyFindById = jest.spyOn(UserRepository, 'findById').mockResolvedValue(userResultFind);
      const spySetStatusById = jest
        .spyOn(UserRepository, 'setStatusById')
        .mockResolvedValue({ affectedRows: 1 });

      const payload = { userId: 4, status: 'Active' };
      const result = await deleteUserService.execute(payload);

      expect(result).toEqual(expect.objectContaining({ affectedRows: 1 }));
      expect(spyFindById).toHaveBeenCalledWith({ id: 4 });
      expect(spySetStatusById).toHaveBeenCalledWith({ id: 4, status: 'Active' });
    });

    it('with user does not exist', async () => {
      const spyFindById = jest.spyOn(UserRepository, 'findById').mockResolvedValue({});
      const spySetStatusById = jest.spyOn(UserRepository, 'setStatusById');

      const payload = { userId: 4, status: 'Active' };
      const result = await deleteUserService.execute(payload);

      expect(result).toEqual(false);
      expect(spyFindById).toHaveBeenCalledWith({ id: 4 });
      expect(spySetStatusById).not.toHaveBeenCalledWith({ id: 4, status: 'Active' });
    });

    it('with system exception', async () => {
      const spyFindById = jest.spyOn(UserRepository, 'findById').mockImplementation(() => {
        throw new Error('mock exception');
      });
      const spySetStatusById = jest.spyOn(UserRepository, 'setStatusById');

      const payload = { userId: 4, status: 'Active' };
      const result = await deleteUserService.execute(payload);

      expect(result).toBeFalsy();
      expect(spyFindById).toHaveBeenCalled();
      expect(spySetStatusById).not.toHaveBeenCalled();
    });
  });
});
