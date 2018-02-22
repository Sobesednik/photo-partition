function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var _require = require('./lib'),
    getAspects = _require.getAspects,
    getSummedWidth = _require.getSummedWidth,
    getRows = _require.getRows,
    flattenArray = _require.flattenArray,
    assignWidthAndHeightToRow = _require.assignWidthAndHeightToRow;

var linearPartition = require('linear-partitioning');
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


function partitions(viewports, photos, desiredHeight, requiredRows) {
  var returnRows = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  var aspects = getAspects(photos);
  var summedWidth = desiredHeight ? getSummedWidth(aspects, desiredHeight) : null;
  var o = Object.keys(viewports).reduce(function (acc, maxWidth) {
    var containerWidth = viewports[maxWidth];
    var rows = summedWidth ? getRows(containerWidth, summedWidth) : requiredRows;
    var partitions = linearPartition(aspects, rows).filter(function (_ref) {
      var length = _ref.length;
      return length;
    });
    var assigned = partitions.map(function (row) {
      return assignWidthAndHeightToRow(row, containerWidth);
    });
    return _extends({}, acc, _defineProperty({}, maxWidth, returnRows ? assigned : flattenArray(assigned)));
  }, {});
  return o;
}

function getWidthHeightCSS(width, height) {
  return "width: ".concat(width, "px; height: ").concat(height, "px;");
}

function getPhotoClassName(index, prefix) {
  var p = prefix === undefined ? 's' : prefix;
  return ".".concat(p).concat(index);
}

function getPhotoCss(index, css, prefix) {
  return "".concat(getPhotoClassName(index, prefix), " { ").concat(css, " }");
}

function getMediaTempate(maxWidth, styles) {
  return "@media (min-width: ".concat(maxWidth, "px) { ").concat(styles, " }\n");
}

function generateMediaQuery(size, photos, prefix) {
  var styles = photos.map(function (photo, index) {
    return getPhotoCss(index, getWidthHeightCSS(photo.width, photo.height, prefix));
  }).join(' ');
  return getMediaTempate(size, styles);
}

function getCSS(partitions, prefix) {
  var css = Object.keys(partitions).map(function (key) {
    return generateMediaQuery(key, partitions[key], prefix);
  }).join('');
  return css;
}

module.exports = {
  partitions: partitions,
  getCSS: getCSS
};