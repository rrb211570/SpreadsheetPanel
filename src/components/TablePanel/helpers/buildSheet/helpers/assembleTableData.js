function assembleTableData(loadedSheet, defaultRows, defaultCols, defaultCellHeight, defaultCellWidth) {
    let [rows, cols] = loadRowsCols(loadedSheet, defaultRows, defaultCols);
    let tableData = createEmptyTable(rows, cols);
    loadTableData(loadedSheet, tableData, rows, cols, defaultCellHeight, defaultCellWidth);
    return tableData;
}

function loadRowsCols(loadedSheet, defaultRows, defaultCols) {
    if (loadedSheet != null && loadedSheet.hasOwnProperty('data')) {
        return [parseInt(loadedSheet.rows, 10), parseInt(loadedSheet.cols, 10)];
    } else return [defaultRows, defaultCols];
}

function createEmptyTable(rows, cols) {
    rows++; // increment to include axis cells
    cols++;
    let tableData = [];
    for (let i = 0; i < rows; ++i) {
        let emptyRow = [];
        for (let i = 0; i < cols; ++i) emptyRow.push({});
        tableData.push(emptyRow);
    }
    return tableData;
}

function loadTableData(loadedSheet, tableData, rows, cols, defaultCellHeight, defaultCellWidth) {
    if (loadedSheet != null && loadedSheet.hasOwnProperty('data')) {
        loadWithCellData(loadedSheet, tableData);
        loadWithGroupData(loadedSheet, tableData, defaultCellWidth);
    }
    applyDefaults(tableData, rows, cols, defaultCellHeight, defaultCellWidth);
    calculateAndApplyMarginLefts(tableData, rows, cols);
}

function loadWithCellData(loadedSheet, tableData) { // cellData does not affect axes
    if (loadedSheet.data.hasOwnProperty('individualData')) {
        for (const individual of loadedSheet.data.individualData) {
            if (individual.entryKey != 'spreadsheet' && !/.col\d+/.test(individual.entryKey)) {
                let rowNum = parseInt(individual.row, 10);
                tableData[rowNum][0].styleMap = individual.hasOwnProperty('styleMap') ?
                    individual.styleMap : [];
            } else if (/.col\d+/.test(individual.entryKey)) {
                let colNum = parseInt(individual.col, 10);
                let rowNum = parseInt(individual.row, 10);
                tableData[rowNum][colNum].val = individual.val;
                tableData[rowNum][colNum].styleMap = individual.hasOwnProperty('styleMap') ?
                    individual.styleMap : [];
            }
        }
    }
}

function loadWithGroupData(loadedSheet, tableData, defaultCellWidth) {
    if (loadedSheet.data.hasOwnProperty('groupData')) {
        for (const group of loadedSheet.data.groupData) {
            if (/^.col\d+$/.test(group.groupName) && group.hasOwnProperty('styleMap')) {
                let colNum = parseInt(group.groupName.match(/.col(\d+)/)[1], 10);
                let widthPair = group.styleMap.filter(pair => pair[0] == 'width');
                // set provided groupData for colNum
                for (let i = 0; i < tableData.length; ++i) {
                    if (!tableData[i][colNum + 1].hasOwnProperty('styleMap')) tableData[i][colNum + 1].styleMap = [];
                    if (i == 0) { // add width and other stylePairs
                        if (widthPair.length != 0) tableData[i][colNum + 1].styleMap.push(widthPair[0]);
                    } else tableData[i][colNum + 1].styleMap.push(...group.styleMap);
                    // if width property in groupData, set marginLeft for every col thereafter
                    if (widthPair.length != 0) {
                        let dx = parseInt(widthPair[0][1], 10) - defaultCellWidth; // dx for existing/default marginLeft
                        for (let j = 1 + colNum + 1; j < tableData[0].length; ++j) {
                            if (!tableData[i][j].hasOwnProperty('styleMap')) tableData[i][j].styleMap = [];
                            let alignPair = tableData[i][j].styleMap.filter(pair => pair[0] == 'marginLeft');
                            if (alignPair.length != 0) { // existing marginLeft
                                tableData[i][j].styleMap = updateMarginLeftInStyleMap(tableData[i][j].styleMap, dx);
                            } else { // default marginLeft
                                tableData[i][j].styleMap.push(['marginLeft', defaultCellWidth * (j - 2) + defaultCellWidth / 2 + dx]);
                            }
                        }
                    }
                }
            } else if (/^.row\d+$/.test(group.groupName) && group.hasOwnProperty('styleMap')) {
                let rowNum = parseInt(group.groupName.match(/.row(\d+)/)[1], 10);
                let heightPair = group.styleMap.filter(pair => pair[0] == 'height');
                if (heightPair.length != 0) {
                    if (!tableData[rowNum][0].hasOwnProperty('styleMap')) tableData[rowNum][0].styleMap = [];
                    if (!tableData[rowNum][1].hasOwnProperty('styleMap')) tableData[rowNum][1].styleMap = [];
                    tableData[rowNum][0].styleMap = [heightPair[0]];
                    tableData[rowNum][1].styleMap = [heightPair[0]];
                }
                for (let i = 2; i < tableData[rowNum].length; ++i) {
                    if (!tableData[rowNum][i].hasOwnProperty('styleMap')) tableData[rowNum][i].styleMap = []; tableData[rowNum][i].styleMap.push(...group.styleMap);
                }
            }
        }
    }
}

function updateMarginLeftInStyleMap(styleMap, dx) {
    return styleMap.map(pair => pair[0] == 'marginLeft' ?
        [pair[0], parseInt(pair[1], 10) + dx] : pair);
}

// apply default value, height, and width
function applyDefaults(tableData, rows, cols, defaultCellHeight, defaultCellWidth) {
    for (let i = 0; i < rows + 1; ++i) {
        for (let j = 0; j < cols + 1; ++j) {
            let entry = tableData[i][j];
            if (i > 0 && j > 0 && !entry.hasOwnProperty('val')) entry.val = '';
            if (!entry.hasOwnProperty('styleMap')) {
                entry.styleMap = [];
                entry.styleMap.push(['height', defaultCellHeight]);
                if (j == 0) entry.styleMap.push(['width', defaultCellWidth / 2]);
                else if (j > 0) entry.styleMap.push(['width', defaultCellWidth]);
            } else {
                let heightPair = entry.styleMap.filter(pair => pair[0] == 'height');
                let widthPair = entry.styleMap.filter(pair => pair[0] == 'width');
                if (heightPair.length == 0) entry.styleMap.push(['height', defaultCellHeight]);
                if (widthPair.length == 0) entry.styleMap.push(['width', defaultCellWidth]);
            }
            tableData[i][j] = entry;
        }
    }
}

function calculateAndApplyMarginLefts(tableData, rows, cols) {
    let margins = getTopAxisMargins(tableData);
    for (let i = 0; i < rows + 1; ++i) {
        for (let j = 0; j < cols + 1; ++j) {
            let entry = tableData[i][j];
            entry.styleMap.push(['marginLeft', margins[j]]);
            tableData[i][j] = entry;
        }
    }
}

function getTopAxisMargins(tableData) {
    let margins = [0];
    for (let j = 1; j < tableData[0].length; ++j) {
        let priorEntry = tableData[0][j - 1];
        let priorEntryWidth = priorEntry.styleMap.filter(pair => pair[0] == 'width')[0][1];
        margins.push(margins[margins.length - 1] + priorEntryWidth);
    }
    return margins;
}

export default assembleTableData;