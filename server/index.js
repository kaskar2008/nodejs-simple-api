const http = require('http');
const https = require('https');
const fs = require('fs');
const Router = require('../router');

const HTTPModes = { http, https };

/**
 * HTTP and HTTPS server class
 */
class APIServer {
  /**
   * Creates an instance
   * @param {*} options Server options
   */
  constructor(options = {}) {
    this.options = options;
    this.middlewares = [];
    this.router = new Router({
      routes: options.routes,
      middlewares: this.middlewares
    });
    this.mode = options.serverMode || 'http';
  }

  /**
   * Creates a server with listener
   * @param {string} mode Server mode [http|https]
   */
  createServer(mode) {
    // prepare name in "this" scope
    let instanceVariable = '$' + mode + 'instance';

    // validate mode. Only http or https are acceptable
    if (!~Object.keys(HTTPModes).indexOf(mode)) {
      throw new Error(`"mode" should be one of [${Object.keys(HTTPModes).join('|')}]`);
    }

    let createServerParams = [];

    // add https specific params
    if (mode === 'https') {
      createServerParams.push({
        key: fs.readFileSync(this.options.httpsOptions.keyPath),
        cert: fs.readFileSync(this.options.httpsOptions.certificatePath)
      });
    }

    // add common handler param
    createServerParams.push((req, res) => this.router.handle(req, res));

    // create an instance
    this[instanceVariable] = HTTPModes[mode].createServer(...createServerParams);

    // set listener to "error" event
    this[instanceVariable].on('error', (e) => {
      console.log('server error', e);
    });

    // return new promise. will be resolver after server starts listening
    return new Promise((resolve, reject) => {
      try {
        // start listen on port and host from config
        this[instanceVariable].listen(this.options[mode + 'Port'], this.options.host, () => {
          // resolve on OK
          resolve({
            [mode + 'Port']: this.options[mode + 'Port']
          });
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * Starts all the necessary servers
   */
  start() {
    return new Promise((resolve, reject) => {
      let info = {
        host: this.options.host
      };

      let promises = [];

      // create both http and https servers
      if (this.mode === 'both') {
        Object.keys(HTTPModes).forEach((mode) => {
          promises.push(this.createServer(mode));
        });
      }
      // or just one
      else {
        promises.push(this.createServer(this.mode));
      }

      // wait for all servers to be started
      Promise.all(promises).then(values => {
        values.forEach(el => {
          info = { ...info, ...el };
        });
        resolve(info);
      });
    });
  }

  /**
   * Adds a middleware to the server
   * @param {function} middleware Middleware function
   */
  addMiddleware(middleware) {
    if (typeof middleware === 'function') {
      this.middlewares.push(middleware);
    }
  }
}

module.exports = APIServer;
