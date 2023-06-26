const fastify = require('fastify');

class FestifyServer {
  init() {
    const app = fastify();

    const port = process.env.HTTP_PORT;

    app.listen({ port }, (err) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      console.log(`Server is running on port ${port}`);
    });

    return app;
  }
}

module.exports = { FestifyServer };
