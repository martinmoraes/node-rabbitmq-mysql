const { logger } = require('../infra/logger');

class UserDeleteService {
  constructor(userRepository, sendMessage) {
    this.userRepository = userRepository;
    this.sendMessage = sendMessage;
  }

  async execute(userId) {
    try {
      const userExists = await this.userRepository.findById({ id: userId });
      if (!this.isUser(userExists)) {
        this.sendMessage(JSON.stringify({ userId }));
        return false;
      }

      return this.userRepository.cancelById({ id: userId });
    } catch (errors) {
      logger.error(errors);

      return false;
    }
  }

  isUser(userExists) {
    return Object.keys(userExists).length > 0;
  }
}

module.exports = { UserDeleteService };
