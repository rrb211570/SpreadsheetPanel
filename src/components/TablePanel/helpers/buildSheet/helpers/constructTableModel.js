import { getHeight, getWidth, getMarginLeft } from "./util.js";

function constructTableModel(tableData, rows, cols, rowWidth) {
    let keyIndex = 0;
    let tableModel = [];

    let rowsArr = constructRows(tableData, rows, cols);
    for (let j = 0; j < rowsArr.length; ++j) {
        let height = getHeight(tableData[j][0]);
        tableModel.push(<div key={keyIndex++} id={`row${j + 1}`} className={`row${j + 1}`} style={{ height: `${height}px`, width: `${rowWidth}px` }}>
            {rowsArr[j]}
        </div>);
    }
    return tableModel;
}

function constructRows(tableData, rows, cols) {
    let keyIndex = 0;
    let rowsArr = [];
    for (let i = 0; i < rows; ++i) {
        let row = [];
        for (let j = 0; j < cols; ++j) {
            let val = tableData[i][j].val;
            let height = getHeight(tableData[i][j]);
            let width = getWidth(tableData[i][j]);
            let marginLeft = getMarginLeft(tableData[i][j]);
            row.push(
                <div key={keyIndex++} className={`row${i + 1} col${j + 1} entryCell`} style={{height: `${height}px`, width: `${width}px`, marginLeft: `${marginLeft}px` }}>
                    <input className='cellInput' onKeyDown={stopPropagationKeyDown} onKeyUp={stopPropagationKeyUp} type='text' defaultValue={val}></input>
                    <div className='cellValueDiv'>
                        <p className='cellValue'>{val}</p>
                    </div>
                    <div className='coverDiv' tabIndex='-1' style={{ boxShadow: i == 0 && j == 0 ? 'inset 0 0 0 2px blue' : 'none' }}></div>
                </div>);
        }
        rowsArr.push(row);
    }
    return rowsArr;
}

function stopPropagationKeyDown(e) {
    document.querySelector('#cellViewPanel__cellTextValue').innerText = document.querySelector('#cellViewPanel__cellTextValue').innerText + e.key;
    e.stopPropagation();
}

function stopPropagationKeyUp(e) {
    e.stopPropagation();
}

export { constructTableModel };