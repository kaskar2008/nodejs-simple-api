class StoreCollection {
  constructor(provider, options) {
    this.provider = provider;
    this.name = options.name;
  }

  find(entry) {
    this.provider.findEntry(this, entry);
  }
}

class StoreEntry {
  constructor(provider, collection, options) {
    this.provider = provider;
    this.collection = collection;
  }

  text() {

  }

  json() {

  }
}

module.exports = {
  StoreCollection,
  StoreEntry
};
