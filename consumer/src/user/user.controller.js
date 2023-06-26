const { AmqpQueueName } = require('../infra/amqpQueueNames');
const { UserRepository } = require('./user.repository');
const { UserRegisterService } = require('./user_register.service');
const { UserCancelService } = require('./user_cancel.service');
const { logger } = require('../infra/logger');

class UserController {
  constructor(channel) {
    this.channel = channel;
  }

  async init() {
    try {
      this.channel.consume(
        AmqpQueueName.USER_REGISTRATION,
        async (msg) => {
          const userDTO = JSON.parse(msg.content.toString());
          await new UserRegisterService(new UserRepository()).execute(userDTO);
        },
        { noAck: true },
      );
    } catch (error) {
      logger.error(error);
    }

    try {
      this.channel.consume(
        AmqpQueueName.USER_CANCELLATION,
        async (msg) => {
          const userDeleteService = new UserCancelService(
            new UserRepository(),
            this.sendMessage(this.channel),
          );
          const payload = JSON.parse(msg.content.toString());
          await userDeleteService.execute(payload);
        },
        { noAck: true },
      );
    } catch (error) {
      logger.error(error);
    }
  }

  sendMessage(channel) {
    return (amqpQueueName, message) => {
      channel.sendToQueue(amqpQueueName, Buffer.from(message));
    };
  }
}
module.exports = { UserController };
