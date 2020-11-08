const unzip = require('./xvd-unzip');

const loadXVD = ({ file }) => {
  if (!file) {
    file = '/Volumes/dev-1/self/projects/xv-data/xv-data-template-1.xvd';
  }
  return new Promise((resolve, reject) => {
    try {
      resolve({
        code: 200,
        data: unzip(file)
      });
    } catch (err) {
      reject(err);
    }
  })
}

module.exports = loadXVD;
