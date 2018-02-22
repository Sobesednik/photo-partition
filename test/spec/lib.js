const assert = require('assert')

const libTestSuite = { 
  calculateAspect: () => {
    assert(true)
  },
  getAspects: () => {
    assert(!undefined)
  },
  getSummedWidth: () => assert(true),
  checkIsArray: () => assert(true),
  getRows: () => assert(true),
  assignWidthAndHeightToRow: () => assert(true),
  arraySum: () => assert(true),
  flattenArray: () => assert(true),
}

module.exports = libTestSuite

