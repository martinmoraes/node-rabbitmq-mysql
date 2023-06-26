const { logger } = require('../infra/logger');

class UserRegisterService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(userDTO) {
    try {
      const userExists = await this.userRepository.findByEmail({ email: userDTO.email });
      if (this.isUser(userExists)) {
        const userToUpdate = this.parseUser(userExists, userDTO);
        return this.update(userToUpdate, userDTO);
      }

      return this.userRepository.insert(userDTO);
    } catch (errors) {
      logger.error(errors);

      return false;
    }
  }

  async update(userToUpdate, userDTO) {
    if (userToUpdate.id != userDTO?.id) {
      logger.error(`user without permission for this operation: ${JSON.stringify(userToUpdate)}`);
      return false;
    }

    return this.userRepository.updateById(userToUpdate);
  }

  parseUser(userExists, userDTO) {
    Object.keys(userExists).forEach((prop) => {
      if (prop !== 'id') {
        userExists[prop] = userDTO[prop];
      }
    });

    return userExists;
  }

  isUser(userExists) {
    return Object.keys(userExists).length > 0;
  }
}

module.exports = { UserRegisterService };
