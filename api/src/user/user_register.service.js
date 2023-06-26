const { logger } = require('./../infra/logger');
const { userSchema } = require('./user_validate.schema');
const { AmqpQueueName } = require('../infra/amqpQueueNames');

class UserRegisterService {
  constructor(httpResponse, sendMessage) {
    this.httpResponse = httpResponse;
    this.sendMessage = sendMessage;
  }

  execute(userDTO) {
    try {
      if (!this.checkUser(userDTO)) {
        return false;
      }

      this.sendMessage(AmqpQueueName.USER_REGISTRATION, JSON.stringify(userDTO));

      this.httpResponse.ok('Request received');
    } catch (error) {
      logger.error(error);
      this.httpResponse.internalError('System failure, please try again later');
    }
  }

  checkUser(userDTO) {
    const errorMessage = this.validateUser(userDTO);

    if (errorMessage?.length > 0) {
      logger.error(JSON.stringify({ userDTO, errorMessage }));
      this.httpResponse.invalidFormat(errorMessage);
      return false;
    }

    return true;
  }

  validateUser(userDTO) {
    const validation = userSchema.validate(userDTO, { abortEarly: false });

    if (validation.error) {
      const errorMessage = validation.error.details.map((error) => {
        return {
          [error.path[0]]: error.message,
        };
      });

      return errorMessage;
    }

    return [];
  }
}

module.exports = { UserRegisterService };
