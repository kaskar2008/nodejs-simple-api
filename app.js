const APIServer = require('./server');
const routes = require('./routes');

class App {
  constructor() {
    this.server = new APIServer({
      port: 5000,
      mode: 'http',
      routes
    });
  }

  async init() {
    try {
      let { port, host } = await this.server.start();
      console.log(`Server is up on ${host}:${port}`);
    } catch (e) {
      console.log(e);
    }
  }

  use(middleware) {
    this.server.addMiddleware(middleware);
  }
}

module.exports = new App();
