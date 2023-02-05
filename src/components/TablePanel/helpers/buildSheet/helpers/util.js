function getWidth(obj) {
    let widthPair = obj.styleMap.filter(pair => pair[0] == 'width')[0];
    return parseInt(widthPair[1], 10);
}

function getMarginLeft(obj) {
    let marginPair = obj.styleMap.filter(pair => pair[0] == 'marginLeft')[0];
    return parseInt(marginPair[1], 10);
}

function getHeight(obj) {
    let heightPair = obj.styleMap.filter(pair => pair[0] == 'height')[0];
    return parseInt(heightPair[1], 10);
}

function getRowsCols(tableData) {
    return [tableData.length - 1, tableData[0].length - 1];
}

function getRowWidth(tableData) {
    let lastColCellMarginLeft = tableData[0][tableData[0].length - 1].styleMap.filter(pair => pair[0] == 'marginLeft')[0][1];
    let lastColCellWidth = tableData[0][tableData[0].length - 1].styleMap.filter(pair => pair[0] == 'width')[0][1];
    return lastColCellMarginLeft + lastColCellWidth;
}

export { getWidth, getMarginLeft, getHeight, getRowsCols, getRowWidth};