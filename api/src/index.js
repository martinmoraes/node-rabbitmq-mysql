require('dotenv').config();
const { logger } = require('./infra/logger');
const { AmqpServer } = require('./infra/amqpServer');
const { FestifyServer: HttpServer } = require('./infra/festifyServer');
const { UserController } = require('./user/user.controller');

(async () => {
  logger.info('Application starting');

  try {
    const amqpChannel = await new AmqpServer().init();

    const httpApp = new HttpServer().init();

    await new UserController(amqpChannel, httpApp).init();

    logger.info('Success in establishing the connections');
  } catch (error) {
    logger.error('Error establishing connections', error);
  }
})();
