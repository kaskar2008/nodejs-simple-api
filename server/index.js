const http = require('http');
const https = require('https');
const Router = require('../router');

const HTTPModes = { http, https };

class APIServer {
  constructor(options = {}) {
    this.port = options.port || 3000;
    this.host = options.host || 'localhost';
    this.middlewares = [];
    this.router = new Router({
      routes: options.routes,
      middlewares: this.middlewares
    });
    this.mode = options.mode || 'http';
  }

  start() {
    if (!~Object.keys(HTTPModes).indexOf(this.mode)) {
      throw new Error(`"mode" should be one of [${Object.keys(HTTPModes).join('|')}]`);
    }

    this.$instance = HTTPModes[this.mode].createServer((req, res) => this.router.handle(req, res));

    this.$instance.on('error', (e) => {
      console.log('server error', e);
    });

    return new Promise((resolve, reject) => {
      try {
        this.$instance.listen(this.port, this.host, () => {
          resolve({
            port: this.port,
            host: this.host
          });
        });
      } catch (e) {
        reject(e);
      }
    })
  }

  addMiddleware(middleware) {
    if (typeof middleware === 'function') {
      this.middlewares.push(middleware);
    }
  }
}

module.exports = APIServer;
