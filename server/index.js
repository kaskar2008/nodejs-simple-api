const http = require('http');
const https = require('https');
const Router = require('../router');

const HTTPModes = { http, https };

class APIServer {
  constructor(options = {}) {
    this.httpPort = options.httpPort || 3000;
    this.httpsPort = options.httpsPort || 5000;
    this.host = options.host || 'localhost';
    this.middlewares = [];
    this.router = new Router({
      routes: options.routes,
      middlewares: this.middlewares
    });
    this.mode = options.mode || 'http';
  }

  createServer(mode) {
    let instanceVariable = '$' + mode + 'instance';
    if (!~Object.keys(HTTPModes).indexOf(mode)) {
      throw new Error(`"mode" should be one of [${Object.keys(HTTPModes).join('|')}]`);
    }

    Object.defineProperty(this, instanceVariable, {
      value: HTTPModes[mode].createServer((req, res) => this.router.handle(req, res))
    });

    this[instanceVariable].on('error', (e) => {
      console.log('server error', e);
    });

    return new Promise((resolve, reject) => {
      try {
        this[instanceVariable].listen(this[mode + 'port'], this.host, () => {
          resolve({
            [mode + 'Port']: this[mode + 'Port']
          });
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  start() {
    return new Promise((resolve, reject) => {
      let info = {
        host: this.host
      };

      let promises = [];
      if (this.mode === 'both') {
        Object.keys(HTTPModes).forEach((mode) => {
          promises.push(this.createServer(mode));
        });
      } else {
        promises.push(this.createServer(this.mode));
      }
      Promise.all(promises).then(values => {
        values.forEach(el => {
          info = { ...info, ...el };
        });
        resolve(info);
      });
    });
  }

  addMiddleware(middleware) {
    if (typeof middleware === 'function') {
      this.middlewares.push(middleware);
    }
  }
}

module.exports = APIServer;
