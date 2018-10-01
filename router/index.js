const url = require('url');

const defaultHandlers = {
  500: (req, res, e) => {
    res.writeHead(500, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({
      error: e.toString()
    }));
  },
  404: (req, res) => {
    res.writeHead(404);
    res.end();
  },
  200: (req, res, body) => {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(body);
  }
}

class Router {
  constructor(options = {}) {
    this.routes = options.routes || {};
    this.middlewares = options.middlewares || [];
    this.handlers = { ...defaultHandlers, ...(options.handlers || {}) };
  }

  goThroughMiddlewares(data, index = 0) {
    return new Promise((resolve, reject) => {
      this.middlewares[index](data, (e) => {
        if (e) {
          reject(e);
        } else {
          if (index < this.middlewares.length - 1) {
            resolve(this.goThroughMiddlewares(data, ++index));
          } else {
            resolve(data);
          }
        }
      });
    });
  }

  async handle(req, res) {
    let parsedUrl = url.parse(req.url, true);
    let trimmedPath = parsedUrl.pathname.replace(/^\/+|\/+$/g, '');

    let pathHandler = this.routes[trimmedPath];
    let controller = null;
    let data = {
      request: req,
      response: res,
      route: parsedUrl
    };

    try {
      data = await this.goThroughMiddlewares(data);
    } catch (e) {
      this.handlers[500](data.request, data.response, e);
      return false;
    }

    if (pathHandler) {
      controller = pathHandler[data.request.method.toLowerCase()];
    }

    if (!pathHandler || !controller) {
      this.handlers[404](data.request, data.response);
      return false;
    }

    let result = null;

    try {
      if (typeof controller === 'function') {
        result = controller(data);

        if (typeof result === 'function') {
          return result(data.request, data.response);
        } else {
          result = JSON.stringify(result);
        }
      } else {
        result = JSON.stringify(controller);
      }

      this.handlers[200](data.request, data.response, result);
    } catch (e) {
      this.handlers[500](data.request, data.response, e);
    }
  }
}

module.exports = Router;
