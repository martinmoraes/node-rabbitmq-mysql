require('dotenv').config();
const { logger } = require('./infra/logger');
const { AmqpServer } = require('./infra/amqpServer');
const { FestifyServer: HttpServer } = require('./infra/festifyServer');
const { UserController } = require('./user/user.controller');

(async () => {
  logger.info('Application starting');

  try {
    logger.info('AmqpServer starting');
    const amqpChannel = await new AmqpServer().init();

    logger.info('HttpServer starting');
    const httpApp = new HttpServer().init();

    logger.info('UserController starting');
    await new UserController(amqpChannel, httpApp).init();

    logger.info('Success in establishing the connections');
  } catch (error) {
    logger.error('Error establishing connections', error);
  }
})();
