module.exports = (data, next) => {
  if (data.body) {
    data.body.lilu = 'my test middleware';
  }

  next();
}
