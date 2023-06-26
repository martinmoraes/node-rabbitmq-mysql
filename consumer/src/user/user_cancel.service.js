const { logger } = require('../infra/logger');
const { AmqpQueueName } = require('../infra/amqpQueueNames');

class UserCancelService {
  constructor(userRepository, sendMessage) {
    this.userRepository = userRepository;
    this.sendMessage = sendMessage;
  }

  async execute({ userId, status }) {
    try {
      const userExists = await this.userRepository.findById({ id: userId });
      if (!this.isUser(userExists)) {
        this.sendMessage(
          AmqpQueueName.USER_NOT_CANCELED,
          JSON.stringify({ userId, status, createdAt: new Date().toISOString() }),
        );
      }

      return this.userRepository.setStatusById({ id: userId, status });
    } catch (errors) {
      logger.error(errors);

      return false;
    }
  }

  isUser(userExists) {
    return Object.keys(userExists).length > 0;
  }
}

module.exports = { UserCancelService };
