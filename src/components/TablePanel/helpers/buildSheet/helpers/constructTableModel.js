
let alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

let keyIndex; // global variable, maybe bad?

function constructTableModel(tableData, defaultHeight, defaultWidth) {
    keyIndex = 0;
    let tableModel = [];
    let [rows, cols] = getRowsCols(tableData);
    let topAxis = constructTopAxis(tableData, cols, defaultHeight, defaultWidth);
    let rowsArr = constructRows(tableData, rows, cols, defaultWidth);
    let rowWidth = getRowWidth(tableData);
    tableModel.push(<div key={keyIndex++} id='row0' className='row0' style={{ height: `${defaultHeight}px` }}>{topAxis}</div>);
    for (let j = 0; j < rowsArr.length; ++j) {
        let height = getHeight(tableData[j + 1][0]);
        tableModel.push(<div key={keyIndex++} id={`row${j + 1}`} className={`row${j + 1}`} style={{ height: `${height}px`, width: `${rowWidth}px` }}>
            {rowsArr[j]}
        </div>);
    }
    return tableModel;
}

function getRowsCols(tableData) {
    return [tableData.length - 1, tableData[0].length - 1];
}

function constructTopAxis(tableData, cols, defaultHeight, defaultWidth) {
    let topAxis = [];
    topAxis.push(<div key={keyIndex++} className='row0 col0 origin' style={{ height: `${defaultHeight}px`, width: `${defaultWidth / 2}px` }}>&nbsp;</div>)
    for (let i = 0; i < cols; ++i) {
        try {
            let letter = alphabet[i < 26 ? i : i % 26];
            let width = getWidth(tableData[0][i + 1]);
            let marginLeft = getMarginLeft(tableData[0][i + 1]);
            topAxis.push(<div key={keyIndex++} className={`row0 col${i + 1} AxisX`} style={{ height: `${defaultHeight - 2}px`, width: `${width}px`, marginLeft: `${marginLeft}px`, lineHeight: `${defaultHeight - 2}px` }}><p style={{ margin: 0 }}>{letter}</p><div className='resizer-horizontal'></div></div>)
        } catch (e) {
            throw 'Error: ' + i + ' ' + e;
        }
    }
    return topAxis;
}

function constructRows(tableData, rows, cols, defaultWidth) {
    let rowsArr = [];
    for (let i = 0; i < rows; ++i) {
        let row = [];
        let height = getHeight(tableData[i + 1][1]);
        row.push(
            <div key={keyIndex++} className={`row${i + 1} col0 AxisY`} style={{ height: `${height}px`, width: `${defaultWidth / 2}px` }}>
                <p style={{ margin: 0 }}>{i + 1}</p>
                <div className='resizer-vertical'></div>
            </div>);
        for (let j = 0; j < cols; ++j) {
            let val = tableData[i + 1][j + 1].val;
            let height = getHeight(tableData[i + 1][j + 1]);
            let width = getWidth(tableData[i + 1][j + 1]);
            let marginLeft = getMarginLeft(tableData[i + 1][j + 1]);
            row.push(
                <div key={keyIndex++} className={`row${i + 1} col${j + 1} entryCell`} style={{ height: `${height}px`, width: `${width}px`, marginLeft: `${marginLeft}px` }}>
                    <input onKeyUp={stopPropagation} onKeyDown={stopPropagation} type='text' style={{ position: 'absolute', left: '2px', top: '1px', height: `${height - 6}px`, width: `${width - 8}px`, border: 'none' }} defaultValue={val}></input>
                    <div className='selectionLayer' tabIndex='-1' style={{ position: 'absolute', zIndex: '2', left: '0', top: '0', height: `${height}px`, width: `${width}px`, border: 'none', opacity: 0.5 }}></div>
                    <div className='highlightLayer' style={{ position: 'absolute', zIndex: '1', left: '0', top: '0', height: `${height - 4}px`, width: `${width - 4}px`, border: 'none' }}></div>
                </div>);
        }
        rowsArr.push(row);
    }
    return rowsArr;
}

function getRowWidth(tableData) {
    let lastColCellMarginLeft = tableData[0][tableData[0].length - 1].styleMap.filter(pair => pair[0] == 'marginLeft')[0][1];
    let lastColCellWidth = tableData[0][tableData[0].length - 1].styleMap.filter(pair => pair[0] == 'width')[0][1];
    return lastColCellMarginLeft + lastColCellWidth;
}

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

function stopPropagation(e) {
    e.stopPropagation();
}

export { constructTableModel, getRowsCols };