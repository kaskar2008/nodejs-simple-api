module.exports = (data, next) => {
  if (data.body && typeof data.body === 'object') {
    data.body.lilu = 'my test middleware';
  }

  next();
}
