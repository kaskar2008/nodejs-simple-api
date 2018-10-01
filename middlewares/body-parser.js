/**
 * Middleware for handling json body in the Request
 */

// acceptable methods
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
  // validate method
  if (~methods.indexOf(data.request.method.toLowerCase())) {
    var body = '';

    data.request.on('data', (data) => {
      body += data;
    });

    data.request.on('end', () => {
      try {
        let contentType = data.request.headers['content-type'];
        console.log(contentType);
        if (contentType === 'application/json') {
          data.body = JSON.parse(body);
        } else if (contentType === 'text/plain') {
          data.body = body;
        } else if (contentType.includes('multipart/form-data;')) {
          // TODO: make a handler
        } else if (contentType === 'application/x-www-form-urlencoded') {
          // TODO: make a handler
        }
      } catch (e) {
        next();
      }
      next();
    });
  } else {
    next();
  }
}
