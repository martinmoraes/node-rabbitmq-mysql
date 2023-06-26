const { logger } = require('./../infra/logger');
const { AmqpQueueName } = require('../infra/amqpQueueNames');

class UserCancelService {
  constructor(httpResponse, sendMessage) {
    this.httpResponse = httpResponse;
    this.sendMessage = sendMessage;
  }

  execute(payloadReceived, userId) {
    try {
      if (!this.checkStatus(payloadReceived)) {
        this.httpResponse.invalidFormat('The status has to be "Active", "Cancelled"');
        return false;
      }

      if (isNaN(userId)) {
        this.httpResponse.invalidFormat('The user id has to be a valid number');
        return false;
      }

      this.sendMessage(AmqpQueueName.USER_CANCELLATION, this.messageToSend(payloadReceived, userId));

      this.httpResponse.ok('Request received');
      return true;
    } catch (error) {
      logger.error(error);
      this.httpResponse.internalError('System failure, please try again later');
      return false;
    }
  }

  checkStatus(payloadReceived) {
    const status = ['active', 'Active', 'ACTIVE', 'cancelled', 'Cancelled', 'CANCELLED'];
    return status.includes(payloadReceived?.status);
  }

  messageToSend(payloadReceived, userId) {
    const status = payloadReceived.status.toUpperCase();
    console.log(status);
    return JSON.stringify({ status, userId });
  }
}

module.exports = { UserCancelService };
