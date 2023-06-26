const fastify = require('fastify');
const { logger } = require('./logger');

class FestifyServer {
  init() {
    const app = fastify();

    const port = process.env.HTTP_PORT;

    app.listen({ port }, (err) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      logger.info(`Server is running on port ${port}`);
    });

    return app;
  }
}

module.exports = { FestifyServer };
