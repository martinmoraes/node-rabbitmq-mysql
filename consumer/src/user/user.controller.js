const { AmqpQueueName } = require('../infra/amqp/amqpQueueNames');
const { UserRepository } = require('./user.repository');
const { UserUpsertService } = require('./user_upsert.service');
const { UserDeleteService } = require('./user_delete.service');

class UserController {
  constructor(channel) {
    this.channel = channel;
  }

  init() {
    this.channel.consume(
      AmqpQueueName.USER_REGISTRATION,
      (msg) => {
        const userDTO = this.stringToJson(msg.content.toString());
        new UserUpsertService(new UserRepository()).execute(userDTO[0]);
      },
      { noAck: true },
    );

    this.channel.consume(
      AmqpQueueName.USER_CANCELLATION,
      async (msg) => {
        const userDeleteService = new UserDeleteService(new UserRepository(), this.sendMessage(this.channel));
        const userDTO = this.stringToJson(msg.content.toString());
        await userDeleteService.execute(userDTO);
      },
      { noAck: true },
    );
  }

  sendMessage(channel) {
    return (message) => {
      channel.sendToQueue(AmqpQueueName.USER_NOT_CANCELED, Buffer.from(message));
    };
  }

  stringToJson(input) {
    var result = [];

    input = input.replace(/^\[/, '');
    input = input.replace(/\]$/, '');

    input = input.replace(/},{/g, '};;;{');

    input = input
      .replace(/\\n/g, '\\n')
      .replace(/\\'/g, "\\'")
      .replace(/\\"/g, '\\"')
      .replace(/\\&/g, '\\&')
      .replace(/\\r/g, '\\r')
      .replace(/\\t/g, '\\t')
      .replace(/\\b/g, '\\b')
      .replace(/\\f/g, '\\f');

    // eslint-disable-next-line no-control-regex
    input = input.replace(/[\u0000-\u0019]+/g, '');

    input = input.split(';;;');

    input.forEach(function (element) {
      result.push(JSON.parse(element));
    }, this);

    return result;
  }
}
module.exports = { UserController };
