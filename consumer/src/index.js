require('dotenv').config();
const { sequelize } = require('./infra/sequelize/connect');
const { logger } = require('./infra/logger');
const { AmqpServer } = require('./infra/amqpServer');
const { UserController } = require('./user/user.controller');

(async () => {
  logger.info('Application starting');

  try {
    await sequelize.authenticate();

    const amqpChannel = await new AmqpServer().init();

    new UserController(amqpChannel).init();

    logger.info('Success in establishing the connections');
  } catch (error) {
    logger.error('Error establishing connections', error);
  }
})();
