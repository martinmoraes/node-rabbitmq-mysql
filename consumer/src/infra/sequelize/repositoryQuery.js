const { sequelize } = require('./connect');
const { logger } = require('../logger');

async function executeQuery(sqlQuery, replacements) {
  try {
    const results = await sequelize.query(sqlQuery, replacements);

    return results;
  } catch (error) {
    logger.error(error);
    throw new Error(error.message);
  }
}

module.exports = { executeQuery };
