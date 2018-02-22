const { getAspects, getSummedWidth, getRows, flattenArray, assignWidthAndHeightToRow } = require('./lib')
const linearPartition = require('linear-partitioning')

/**
 * Apply partitions to multiple viewport widths.
 * @param {number[]} viewportWidths - an array with required widths
 * @param {Array} photos - an array with photo objects (photo.width, photo.height)
 * @param {Number} desiredHeight - desired height of each photo after partitioning
 * @param {Number} [requiredRows] - required rows if desiredHeight is not specified
 * @param {boolean} [returnRows=false] Return unflattened structure in rows.
 * @return {Object} An object where keys are viewport widths and values are arrays
 * containing new widths and heights of photos.
 */
function partitions(viewports, photos, desiredHeight, requiredRows, returnRows = false) {
  const aspects = getAspects(photos)
  const summedWidth = desiredHeight ? getSummedWidth(aspects, desiredHeight) : null

  const o = Object.keys(viewports).reduce((acc, maxWidth) => {
    const containerWidth = viewports[maxWidth]
    const rows = summedWidth ? getRows(containerWidth, summedWidth) : requiredRows
    const partitions = linearPartition(aspects, rows)
      .filter(({ length }) => length)

    const assigned = partitions.map(row => assignWidthAndHeightToRow(row, containerWidth))
    return {
      ...acc,
      [maxWidth]: returnRows ? assigned : flattenArray(assigned),
    }
  }, {})
  return o
}

function getWidthHeightCSS(width, height) {
  return `width: ${width}px; height: ${height}px;`
}

function getPhotoClassName(index, prefix) {
  const p = prefix === undefined ? 's' : prefix
  return `.${p}${index}`
}
function getPhotoCss(index, css, prefix) {
  return `${getPhotoClassName(index, prefix)} { ${css} }`
}

function getMediaTempate(maxWidth, styles) {
  return `@media (min-width: ${maxWidth}px) { ${styles} }\n`
}

function generateMediaQuery(size, photos, prefix) {
  let styles = photos.map((photo, index) =>
    getPhotoCss(index, getWidthHeightCSS(photo.width, photo.height, prefix))
  ).join(' ')
  return getMediaTempate(size, styles)
}

function getCSS(partitions, prefix) {
  const css = Object.keys(partitions)
    .map(key => generateMediaQuery(key, partitions[key], prefix))
    .join('')
  return css
}

module.exports = {
  partitions,
  getCSS,
}
