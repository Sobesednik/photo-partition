var _require = require('zoroaster/assert'),
    deepEqual = _require.deepEqual;

var _require2 = require('../..'),
    partitions = _require2.partitions,
    getCSS = _require2.getCSS;

var photo = {
  width: 400,
  height: 100
};
var indexTestSuite = {
  partitions: {
    'provides a partition': function providesAPartition() {
      var viewports = {
        1000: 800
      };
      var photos = [photo, photo, photo, photo];
      var res = partitions(viewports, photos, 100);
      deepEqual(res, {
        1000: photos
      });
    },
    'provides a partition with rows': function providesAPartitionWithRows() {
      var viewports = {
        1000: 800
      };
      var photos = [photo, photo, photo, photo];
      var res = partitions(viewports, photos, 100, null, true);
      deepEqual(res, {
        1000: [[photo, photo], [photo, photo]]
      });
    }
  },
  getCSS: function getCSS() {// assert(!undefined)
  }
};
module.exports = indexTestSuite;