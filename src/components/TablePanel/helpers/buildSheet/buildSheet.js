import assembleTableData from './helpers/assembleTableData.js'
import { constructTableModel } from './helpers/constructTableModel.js'

let buildSheet = (loadedSheet, rows, cols, defaultHeight, defaultWidth) => {
    let tableData = assembleTableData(loadedSheet, rows, cols, defaultHeight, defaultWidth);
    console.log(tableData);
    return constructTableModel(tableData, defaultHeight, defaultWidth);
}

export { buildSheet, assembleTableData };