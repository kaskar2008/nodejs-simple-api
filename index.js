const app = require('./app');
const bodyParser = require('./middlewares/body-parser');
const testMiddleware = require('./middlewares/test');

app.use(bodyParser);
app.use(testMiddleware);

app.init();
