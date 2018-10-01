const fs = require('fs');
const path = require('path');
const { StoreCollection } = require('./classes');

function fullPath(base, local) {
  return path.join(base, local);
}

function mkDirByPathSync(baseDir, targetDir) {
  const sep = path.sep;
  const initDir = '';

  return targetDir.split(sep).reduce((parentDir, childDir) => {
    const curDir = path.resolve(baseDir, parentDir, childDir);
    try {
      fs.mkdirSync(curDir);
    } catch (err) {
      if (err.code === 'EEXIST') { // curDir already exists!
        return curDir;
      }

      // To avoid `EISDIR` error on Mac and `EACCES`-->`ENOENT` and `EPERM` on Windows.
      if (err.code === 'ENOENT') { // Throw the original parentDir error on curDir `ENOENT` failure.
        throw new Error(`EACCES: permission denied, mkdir '${parentDir}'`);
      }

      const caughtErr = ['EACCES', 'EPERM', 'EISDIR'].indexOf(err.code) > -1;
      if (!caughtErr || caughtErr && targetDir === curDir) {
        throw err; // Throw if it's just the last created dir.
      }
    }

    return curDir;
  }, initDir);
}

function directoryExists(directory) {
  return new Promise(resolve => {
    fs.stat(directory, function(err, stat) {
      //Check if error defined and the error code is "not exists"
      if ((err && err.errno === -2) || !stat.isFile()) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}

function createFile(path) {
  return new Promise(resolve => {
    fs.open(path, 'wx', (err, fd) => {
      if (!err && fd) {
        fs.close(fd, (err) => {
          if (!err) {
            resolve(true);
          } else {
            resolve(false);
          }
        });
      } else {
        resolve(false);
      }
    });
  });
}

function readFromFile() {

}

function writeToFile() {

}

class FileDBProvider {
  constructor(options) {
    this.datasetDir = options.datasetDir;
    this.datasetExtention = options.datasetExtention || '.json';
  }

  async isCollectionExists(name) {
    return await directoryExists(fullPath(this.datasetDir, name + this.datasetExtention));
  }

  async createCollection(name) {
    let col = await this.getCollection(name);
    if (!col) {
      mkDirByPathSync(this.datasetDir, name.split(path.sep).slice(0, -1).join(path.sep));
      let isCreated = await createFile(fullPath(this.datasetDir, name + this.datasetExtention));
      return isCreated ? await this.getCollection(name) : false;
    } else {
      return col;
    }
  }

  async getCollection(name, isNew) {
    let isExists = await this.isCollectionExists(name);
    if (isExists) {
      return new StoreCollection(this, { name });
    }
  }

  async findEntry(collection, entry) {

  }
}

module.exports = FileDBProvider;
