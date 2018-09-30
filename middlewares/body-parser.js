const methods = [
  'post',
  'put',
  'patch',
  'delete',
  'options',
  'link',
  'unlink',
  'lock',
  'propfind',
  'view'
];

module.exports = (data, next) => {
  if (~methods.indexOf(data.request.method.toLowerCase())) {
    var body = '';

    data.request.on('data', function (data) {
      body += data;
    });

    data.request.on('end', function () {
      try {
        data.body = JSON.parse(body);
      } catch (e) {
        next();
      }
      next();
    });
  } else {
    next();
  }
}
