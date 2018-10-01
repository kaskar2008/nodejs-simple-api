const UserController = require('./controllers/user');

module.exports = {
  'user': {
    get: UserController.index,
    post: UserController.handlePost
  },
  'user/custom/handler/test': {
    get: UserController.myHandler
  },
  'ping': {
    get: 'ok'
  }
};
