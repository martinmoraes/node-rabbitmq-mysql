require('dotenv').config();
const { executeQuery } = require('./mock_user');
const { UserRepository } = require('../user.repository');

describe('UserRepository', () => {
  let userRepository;

  beforeEach(() => {
    userRepository = new UserRepository();
    jest.clearAllMocks();
  });

  describe('findByEmail', () => {
    it('find a user', async () => {
      const spyFindByEmail = jest.spyOn(executeQuery, 'executeQuery').mockResolvedValue([{ id: 1 }]);

      const result = await userRepository.findByEmail({ email: 'a@a.a' });

      expect(result).toEqual(expect.objectContaining({ id: 1 }));
      expect(spyFindByEmail).toHaveBeenCalledWith({ email: 'a@a.a' });
    });
  });
});
