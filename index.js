const lib = require('./lib');
const linearPartition = require('linear-partitioning');

/**
 * Apply linear partitioning algorithm to an array with photos.
 * @param {Number} viewportWidth - width of the container
 * @param {Array<Photo>} photos - an array with photo objects, where
 *              {Number} Photo.width - width of the photo
 *              {Number} Photo.height - height of the photo
 * @param {Number} desiredHeight - desired height after partitioning
 * @param {Number} [requiredRows] - explicit number of rows if desiredHeight
 * is not specified.
 * @return {Array} An array with new widths and heights for each photo.
 */
// function partition(viewportWidth, photos, desiredHeight, requiredRows) {
//     const aspects = lib.getAspects(photos);
//     // console.log('aspects', aspects);
//     const summedWidth = lib.getSummedWidth(aspects, desiredHeight);
//     // console.log('summed width', summedWidth);
//     const rows = lib.getRows(viewportWidth, summedWidth);
//     // console.log('rows', rows);
//     const partitions = linearPartition(aspects, rows);

//     // console.log('partitions', partitions);

//     return lib.flattenArray(partitions.map(row =>
//         lib.assignWidthAndHeightToRow(row, viewportWidth)
//     ));
// }

/**
 * Apply partitions to multiple viewport widths.
 * @param {Array} viewportWidths - an array with required widths
 * @param {Array} photos - an array with photo objects (photo.width, photo.height)
 * @param {Number} desiredHeight - desired height of each photo after partitioning
 * @param {Number} [requiredRows] - required rows if desiredHeight is not specified
 * @return {Object} An object where keys are viewport widths and values are arrays
 * containing new widths and heights of photos.
 */
function partitions(viewports, photos, desiredHeight, requiredRows) {
    // lib.checkIsArray(viewports);
    const aspects = lib.getAspects(photos);
    const summedWidth = desiredHeight ? lib.getSummedWidth(aspects, desiredHeight) : null;
    const o = {};

    Object.keys(viewports).forEach((maxWidth) => {
        const containerWidth = viewports[maxWidth];
        const rows = summedWidth ? lib.getRows(containerWidth, summedWidth) : requiredRows;
        const partitions = linearPartition(aspects, rows);

        o[maxWidth] = lib.flattenArray(partitions.map(row =>
            lib.assignWidthAndHeightToRow(row, containerWidth)
        ));
    });
    return o;
}

// function getClassName(width, height, map, prefix, index) {
//     if (!map[width]) {
//         map[width] = {};
//     }
//     if (!map[width][height]) {
//         map[width][height] = `${prefix}${index}`;
//     }
//     return map[width][height];
// }

// function stylePartition(partition, name) {
//     lib.checkIsArray(partition);
//     const styles = {};
//     const photoStyles = [];
//     partition.forEach(photo => {
//         const styleName = `.s-${name}-${photo.width}-${photo.height}`;
//         const style = styles[styleName];
//         if (!style) {
//             styles[styleName] = `width: ${photo.width}; height: ${photo.height};`;
//         }
//         photoStyles.push(styleName);
//     });
//     return {
//         styles,
//         photos: photoStyles,
//     };
// }

// function stylePartition3(partition, prefix) {
//     lib.checkIsArray(partition);
//     const p = prefix === undefined ? 's' : prefix;
//     const photoStyles = [];
//     const styleMap = {};
//     const styleHash = {};
//     let usedStyles = 0;
//     partition.forEach(photo => {
//         let styleName;
//         const key = `${photo.width}-${photo.height}`;
//         if (styleMap[key]) {
//             styleName = styleMap[key];
//         } else {
//             styleName = `${p}${usedStyles++}`;
//             styleMap[key] = styleName;
//             styleHash[key] = {
//                 width: photo.width,
//                 height: photo.height,
//             };
//         }
//         photoStyles.push(styleName);
//     });
//     const inversedStyles = {};
//     Object.keys(styleMap).forEach(key => {
//         inversedStyles[styleMap[key]] =
//             `width: ${styleHash[key].width}; height: ${styleHash[key].height};`;
//     });
//     return {
//         styles: inversedStyles,
//         photos: photoStyles,
//     };
// }

function getWidthHeightCSS(width, height) {
    return `width: ${width}px; height: ${height}px;`;
}

// function stylePartition4(partition) {
//     lib.checkIsArray(partition);
//     return partition.map(photo => {
//         return `width: ${photo.width}; height: ${photo.height};`;
//     });
// }

// function stylePartition2(partition, prefix) {
//     lib.checkIsArray(partition);
//     const p = prefix === undefined ? 's' : prefix;
//     const photoStyles = [];
//     const widthStyleMap = {};
//     const heightStyleMap = {};
//     let usedWidthStyles = 0;
//     let usedHeightStyles = 0;
//     partition.forEach((photo, index) => {
//         let styleNameWidth;
//         let styleNameHeight;
//         if (widthStyleMap[photo.width]) {
//             styleNameWidth = widthStyleMap[photo.width];
//         } else {
//             styleNameWidth = `${p}w${usedWidthStyles++}`;
//             widthStyleMap[photo.width] = styleNameWidth;
//         }
//         if (heightStyleMap[photo.height]) {
//             styleNameHeight = heightStyleMap[photo.height];
//         } else {
//             styleNameHeight = `${p}h${usedHeightStyles++}`;
//             heightStyleMap[photo.height] = styleNameHeight;
//         }
//         photoStyles.push([styleNameWidth, styleNameHeight]);
//     });
//     const inversedStyles = {};
//     Object.keys(widthStyleMap).forEach(key => {
//         inversedStyles[widthStyleMap[key]] = `width: ${key};`;
//     });
//     Object.keys(heightStyleMap).forEach(key => {
//         inversedStyles[heightStyleMap[key]] = `height: ${key};`;
//     });
//     return {
//         styles: inversedStyles,
//         photos: photoStyles,
//     };
// }

// function stylePartitions(partitions, prefix) {
//     const styles = {};
//     Object.keys(partitions).forEach(key => {
//         styles[key] = stylePartition4(partitions[key]);
//     });
//     return styles;
// }

function getPhotoClassName(index, prefix) {
    const p = prefix === undefined ? 's' : prefix;
    return `.${p}${index}`;
}
function getPhotoCss(index, css, prefix) {
    return `${getPhotoClassName(index, prefix)} { ${css} }`;
}

function getMediaTempate(maxWidth, styles) {
    return `@media (min-width: ${maxWidth}px) { ${styles} }\n`;
}

function generateMediaQuery(size, photos, prefix) {
    let styles = photos.map((photo, index) =>
        getPhotoCss(index, getWidthHeightCSS(photo.width, photo.height, prefix))
    ).join(' ');
    return getMediaTempate(size, styles);
}

function getCSS(partitions, prefix) {
    const css = Object
        .keys(partitions)
        .map(key => generateMediaQuery(key, partitions[key], prefix))
        .join('');
    return css;
}

// function stylePartitions(partitions) {
//     const styles = {};
//     const photos = [];
//     Object.keys(partitions).forEach(key => {
//         const styled = stylePartition(partitions[key], key);
//         styles[key] = styled.styles;
//         styled.photos.forEach((photoStyle, index) => {
//             if (photos[index] === undefined) {
//                 photos[index] = photoStyle;
//             } else {
//                 photos[index] += ` ${photoStyle}`;
//             }
//         });
//     });
//     return {
//         styles,
//         photos,
//     };
// }

module.exports = {
    // partition,
    partitions,
    // generateMediaQuery,
    getCSS,
    // stylePartition,
    // stylePartition2,
    // stylePartition3,
    // stylePartition4,
    // stylePartitions,
    // stylePartitions2,
    // nameStyledPartitions,
    // getClassName,
};
