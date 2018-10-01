const storeInterface = require('./interface');
const StoreProvider = require('./providers/fileDB');

class Store extends storeInterface {
  constructor(options = {}) {
    super();
    this.provider = new StoreProvider(options.provider);
  }
}

module.exports = Store;
