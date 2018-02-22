function calculateAspect(width, height) {
  if (width === undefined) {
    throw new Error('Photo does not have width');
  }

  if (width === 0) {
    throw new Error('Photo has 0 width');
  }

  if (width < 0) {
    throw new Error('Photo has negative width');
  }

  if (height === undefined) {
    throw new Error('Photo does not have height');
  }

  if (height === 0) {
    throw new Error('Photo has 0 height');
  }

  if (height < 0) {
    throw new Error('Photo has negative height');
  }

  return width / height;
}
/**
 * Map photos array to array of aspect ratios.
 * @param {Array} photos - array with photos
 * @return {Array} An array of aspect ratios.
 */


function getAspects(photos) {
  checkIsArray(photos);
  return photos.map(function (photo) {
    return photo.aspect ? photo.aspect : calculateAspect(photo.width, photo.height);
  });
}
/**
 * Calculate total width adjusted to desired height.
 * @param {Array<Number>} aspects - array of aspect ratios
 * @param {Number} desiredHeight - desired height of each photo
 * @return {Number} The sum of widths of images resized to the given height.
 */


function getSummedWidth(aspects, desiredHeight) {
  return arraySum(aspects) * desiredHeight;
}
/**
 * Return number of rows required to fit all photos.
 * @param {Number} viewportWidth - the maximum width that photos can occupy
 * @param {Number} summedWidth - the total width of photos
 * @return {Number} Number of rows.
 */


function getRows(viewportWidth, summedWidth) {
  return Math.round(summedWidth / viewportWidth) || 1;
}
/**
 * Check that argument is an array.
 * @param {Array} array - the array to check.
 * @throws {Error} An error if passed argument is not an array.
 */


function checkIsArray(array) {
  if (!Array.isArray(array)) {
    throw new Error('Argument must be an array');
  }
}
/**
 * Return the sum of all elements in the array.
 * @param {Array} array - the array with elements
 * @return {Number} Sum of elements in the array.
 */


function arraySum(array) {
  checkIsArray(array);
  return array.reduce(function (sum, element) {
    return sum + element;
  }, 0);
}
/**
 * Calculate width for every picture in a row.
 * @param {Array} row - an array with aspect ratios
 * @param {Number} viewportWidth - width of the container
 * @return {Array} An array with widths.
 */


function assignWidthAndHeightToRow(row, viewportWidth) {
  if (viewportWidth === undefined) {
    throw new Error('Viewport with must be given');
  }

  var summedRatios = arraySum(row);
  var height = Math.round(viewportWidth / summedRatios);
  var rowMap = row.map(function (aspect) {
    return {
      height: height,
      width: Math.round(height * aspect)
    };
  });
  var totalNewWidth = rowMap.reduce(function (acc, photo) {
    return acc + photo.width;
  }, 0);
  var diff = viewportWidth - totalNewWidth;
  rowMap[rowMap.length - 1].width += diff; // normalise edge cases

  return rowMap;
}
/**
 * Flattens a nested array.
 * @param {Array} array - array to flatten.
 * @return {Array} - an array expanded to a single level.
 * @throws {Error} An error if argument is not an array.
 */


function flattenArray(array) {
  checkIsArray(array);
  return array.reduce(function (prevValue, currentElement) {
    currentElement.forEach(function (element) {
      prevValue.push(element);
    });
    return prevValue;
  }, []);
}

module.exports = {
  calculateAspect: calculateAspect,
  getAspects: getAspects,
  getSummedWidth: getSummedWidth,
  checkIsArray: checkIsArray,
  getRows: getRows,
  assignWidthAndHeightToRow: assignWidthAndHeightToRow,
  arraySum: arraySum,
  flattenArray: flattenArray
};