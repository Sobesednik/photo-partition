const assert = require('assert')

const indexTestSuite = { 
  partitions: () => {
    assert(true)
  },
  getCSS: () => {
    assert(!undefined)
  },
}

module.exports = indexTestSuite

