const currentEnv = process.env.NODE_ENV || 'development';
const commonConfig = require('./common');
const configs = {
  development: require('./dev'),
  production: require('./prod')
};

module.exports = {
  ...commonConfig,
  ...(configs[currentEnv] || {}),
  env: currentEnv
}
