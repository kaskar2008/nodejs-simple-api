const app = require('./app');
const bodyParser = require('./middlewares/body-parser');
const testMiddleware = require('./middlewares/test');

// Add some middlewares
app.use(bodyParser);
app.use(testMiddleware);

// Initialize entire application
app.init();
