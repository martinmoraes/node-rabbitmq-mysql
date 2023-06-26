const { HttpResponse } = require('../infra/httpResponse');
const { UserRegisterService } = require('./user_register.service');
const { UserCancelService } = require('./user_cancel.service');

class UserController {
  constructor(amqpChannel, httpAPP) {
    this.amqpChannel = amqpChannel;
    this.httpAPP = httpAPP;
  }

  async init() {
    this.httpAPP.post('/user', async (request, response) => {
      const userDTO = request.body;
      const userRegisterService = new UserRegisterService(
        new HttpResponse(response),
        this.sendMessage(this.amqpChannel),
      );
      await userRegisterService.execute(userDTO);
    });

    this.httpAPP.delete('/user/:id', async (request, response) => {
      const userId = request.params.id;
      const payloadReceived = request.body;
      const userCancelService = new UserCancelService(
        new HttpResponse(response),
        this.sendMessage(this.amqpChannel),
      );
      await userCancelService.execute(payloadReceived, userId);
    });

    this.httpAPP.get('/ping', async (request, response) => {
      response.send('pong');
    });
  }

  sendMessage(channel) {
    return (amqpQueueName, message) => {
      channel.sendToQueue(amqpQueueName, Buffer.from(message));
    };
  }
}

module.exports = { UserController };
