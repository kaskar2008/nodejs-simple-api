const UserController = require('./controllers/user');

/**
 * Route leaf could be a everything that can be JSONify or a custom function
 */
module.exports = {
  user: {
    get: UserController.index,
    post: UserController.handlePost
  },
  'user/custom/handler/test': {
    get: UserController.myHandler
  },
  ping: {
    get: 'ok'
  },
  hello: {
    get: (data) => ({
      message: `Welcome to my reality${data.route.query && data.route.query.name ? ', ' + data.route.query.name : ''}`
    })
  }
};
