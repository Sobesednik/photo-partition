const { deepEqual }  = require('zoroaster/assert')
const { partitions, getCSS } = require('../..')

const photo = { width: 400, height: 100 };

const indexTestSuite = {
  partitions: {
    'provides a partition'() {
      const viewports = { 1000: 800 }
      const photos = [
        photo,
        photo,
        photo,
        photo,
      ]
      const res = partitions(viewports, photos, 100)
      deepEqual(res, {
        1000: photos,
      })
    },
    'provides a partition with rows'() {
      const viewports = { 1000: 800 }
      const photos = [
        photo,
        photo,
        photo,
        photo,
      ]
      const res = partitions(viewports, photos, 100, null, true)
      deepEqual(res, {
        1000: [[photo, photo], [photo, photo]],
      })
    },
  },
  getCSS() {
    // assert(!undefined)
  },
}

module.exports = indexTestSuite

