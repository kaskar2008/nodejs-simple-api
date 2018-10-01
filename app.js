const APIServer = require('./server');
const routes = require('./routes');
const config = require('./config');

const path = require('path');
const Store = require('./store');

/**
 * Main application class
 */
class App {
  constructor() {
    this.server = new APIServer({
      ...config,
      routes
    });

    // store testing
    let store = new Store({
      provider: {
        datasetDir: path.join(__dirname, './.data')
      }
    });

    store.createCollection('test/users/nested/lol').then(col => {
      if (col) {
        console.log('created ' + col.name + ' collection');
      }
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

  /**
   * Adds middleware to the application
   * @param {function} middleware Middleware function
   */
  use(middleware) {
    this.server.addMiddleware(middleware);
  }
}

module.exports = new App();
