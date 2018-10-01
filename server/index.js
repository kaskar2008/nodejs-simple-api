const http = require('http');
const https = require('https');
const fs = require('fs');
const Router = require('../router');

const HTTPModes = { http, https };

class APIServer {
  constructor(options = {}) {
    this.options = options;
    this.middlewares = [];
    this.router = new Router({
      routes: options.routes,
      middlewares: this.middlewares
    });
    this.mode = options.serverMode || 'http';
  }

  createServer(mode) {
    let instanceVariable = '$' + mode + 'instance';
    if (!~Object.keys(HTTPModes).indexOf(mode)) {
      throw new Error(`"mode" should be one of [${Object.keys(HTTPModes).join('|')}]`);
    }

    let createServerParams = [];

    if (mode === 'https') {
      createServerParams.push({
        key: fs.readFileSync(this.options.httpsOptions.keyPath),
        cert: fs.readFileSync(this.options.httpsOptions.certificatePath)
      });
    }

    createServerParams.push((req, res) => this.router.handle(req, res));

    this[instanceVariable] = HTTPModes[mode].createServer(...createServerParams);

    this[instanceVariable].on('error', (e) => {
      console.log('server error', e);
    });

    return new Promise((resolve, reject) => {
      try {
        this[instanceVariable].listen(this.options[mode + 'Port'], this.options.host, () => {
          resolve({
            [mode + 'Port']: this.options[mode + 'Port']
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
        host: this.options.host
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
