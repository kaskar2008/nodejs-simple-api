/**
 * Middleware for testing
 * Just adds a key "lilu" to the body
 * if it is an object
 */
module.exports = (data, next) => {
  if (data.body && typeof data.body === 'object') {
    data.body.lilu = 'my test middleware';
  }

  next();
}
