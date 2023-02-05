import assembleTableData from './helpers/assembleTableData.js';
import { getRowWidth } from './helpers/util.js';
import { constructAxisX, constructAxisY } from './helpers/constructAxes.js';
import { constructTableModel } from './helpers/constructTableModel.js';
import { store } from '../../../../store/store.js';
import { setTableDimensions } from '../../../../store/reducers/tableDimensionsSlice.js';
import { setRowsAndCols } from '../../../../store/reducers/tableDimensionsSlice.js';

let AxisX;
let AxisY;
let table;

let buildSheet = (loadedSheet, defaultRows, defaultCols, defaultHeight, defaultWidth) => {
    let [totalRows, totalCols] = loadRowsCols(loadedSheet, defaultRows, defaultCols);
    let tableData = assembleTableData(loadedSheet, totalRows, totalCols, defaultHeight, defaultWidth);
    console.log(tableData);
    let rowWidth = getRowWidth(tableData);

    AxisX = constructAxisX(tableData, totalCols, defaultHeight, defaultWidth);
    AxisY = constructAxisY(tableData, totalRows, defaultWidth);
    table = constructTableModel(tableData, totalRows, totalCols, rowWidth);

    const tableHeight = (totalRows + 1) * defaultHeight;
    const tableWidth = (defaultCols * defaultWidth) + (defaultWidth / 2);
    store.dispatch(setTableDimensions({ height: tableHeight, width: tableWidth }));
    return [tableHeight, tableWidth];
}

function loadRowsCols(loadedSheet, defaultRows, defaultCols) {
    let rowsAndCols;
    if (loadedSheet != null && loadedSheet.hasOwnProperty('data')) {
        rowsAndCols = [parseInt(loadedSheet.rows, 10), parseInt(loadedSheet.cols, 10)];
        store.dispatch(setRowsAndCols({ rows: parseInt(loadedSheet.rows, 10), cols: parseInt(loadedSheet.cols, 10) }));
    } else {
        rowsAndCols = [defaultRows, defaultCols];
        store.dispatch(setRowsAndCols({ rows: defaultRows, cols: defaultCols }));
    }
    return rowsAndCols;
}

export { buildSheet, AxisX, AxisY, table };