const amqp = require('amqplib');
const { logger } = require('./logger');
const { AmqpQueueName } = require('./amqpQueueNames');

class AmqpServer {
  async init() {
    try {
      const connection = await amqp.connect(process.env.AMQP_HOST);
      const channel = await connection.createChannel();

      await this.checkQueue(channel);

      return channel;
    } catch (error) {
      logger.error(error);
    }
  }

  async checkQueue(channel) {
    Object.keys(AmqpQueueName).forEach(async (queueName) => {
      const result = await channel.assertQueue(queueName);
      console.log(result);
    });
  }
}

module.exports = { AmqpServer };
