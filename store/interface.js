class storeInterface {
  async createCollection(name) {
    return await this.provider.createCollection(name);
  }

  async getCollection(name) {
    return await this.provider.getCollection(name);
  }
}

module.exports = storeInterface;
