const APIServer = require('./server');
const routes = require('./routes');
const config = require('./config');

class App {
  constructor() {
    this.server = new APIServer({
      ...config,
      routes
    });
  }

  async init() {
    try {
      let info = await this.server.start();
      let httpPostString = info.httpPort ? `\nhttp port: ${info.httpPort} ` : '';
      let httpsPostString = info.httpsPort ? `\nhttps port: ${info.httpsPort} ` : '';
      console.log(`Server is up (serverMode: ${config.serverMode}) on ${info.host} (${config.env} mode) ${httpPostString}${httpsPostString}`);
    } catch (e) {
      console.log(e);
    }
  }

  use(middleware) {
    this.server.addMiddleware(middleware);
  }
}

module.exports = new App();
