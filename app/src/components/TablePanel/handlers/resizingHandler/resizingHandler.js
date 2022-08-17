import Data from '../../../../data/data.js';
import { hasClass } from '../../../../misc/util.js'
import recordChange from '../../../../data/modifiers/recordChange.js';
import { store } from './../../../../store/store.js'
import { setSheetDimensions } from './../../../../store/reducers/sheetDimensionsSlice.js'

function applyResizers() {
    fixResizers('AxisX');
    fixResizers('AxisY');
}

function fixResizers(axis) {
    let storeState = store.getState();
    let [tableHeight, tableWidth] = [storeState.sheetDimensions.tableHeight, storeState.sheetDimensions.tableWidth];
    const axisEntries = [...document.querySelectorAll('.' + axis)]
    axisEntries.forEach(axisCell => {
        let resizer = axisCell.querySelector('div');
        setResizerDimensions(resizer, tableHeight, tableWidth);
        if (axis == 'AxisX') createResizableCol(axisCell, resizer);
        else createResizableRow(axisCell, resizer)
    });
}

function createResizableCol(axisCell, resizer) {
    let x = 0;
    let w = 0;
    const colNum = parseInt([...axisCell.classList].filter(name => /^col\d+$/.test(name))[0].match(/(\d+)/)[0], 10);
    let initialTableHeight, initialTableWidth;
    let dataBeforeChange = new Data();
    let dataAfterChange = new Data();
    let colMarginsLeft = [];
    let changeOccurred = false;

    const mouseDownHandler = function (e) {
        let sheetDimensions = store.getState().sheetDimensions;
        [initialTableHeight, initialTableWidth] = [sheetDimensions.tableHeight, sheetDimensions.tableWidth];
        document.querySelector(`.AxisX.col${colNum} > .resizer-horizontal`).style.height = `${initialTableHeight}px`;
        x = e.clientX;
        w = parseInt(window.getComputedStyle(axisCell).width, 10);
        dataBeforeChange = getResizableColData(colNum, w, initialTableWidth); // store current state
        storeColMargins(colMarginsLeft, colNum);
        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
        resizer.classList.add('resizing-horizontal');
    };

    // disable resizing if document.width == content.width
    const mouseMoveHandler = function (e) {
        changeOccurred = x != e.clientX ? true : false;
        const dx = w + e.clientX - x < 0 ? -w + 1 : e.clientX - x; // set dx so as to maintain 1 pixel minimum width
        updateWidths(colNum, w, dx);
        updateColMargins(colNum + 1, colMarginsLeft, dx);
        let newTableWidth = initialTableWidth + dx;
        store.dispatch(setSheetDimensions({ tableHeight: initialTableHeight, tableWidth: newTableWidth }));
    };

    const mouseUpHandler = function () {
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
        resizer.classList.remove('resizing-horizontal');
        resizer.style.height = document.querySelector('.AxisX').style.height;
        if (changeOccurred) {
            let newWidth = parseInt(axisCell.style.width, 10);
            dataAfterChange = getResizableColData(colNum, newWidth, store.getState().sheetDimensions.tableWidth)
            recordChange(dataBeforeChange, dataAfterChange);
            changeOccurred = false;
        }
        colMarginsLeft = [];
    };

    resizer.addEventListener('mousedown', mouseDownHandler);
}

function createResizableRow(axisCell, resizer) {
    let y = 0;
    let h = 0;
    const rowNum = parseInt([...axisCell.classList].filter(name => /^row\d+$/.test(name))[0].match(/(\d+)/)[0], 10);
    let initialTableHeight, initialTableWidth;
    let dataBeforeChange = new Data();
    let dataAfterChange = new Data();
    let changeOccurred = false;

    const mouseDownHandler = function (e) {
        let sheetDimensions = store.getState().sheetDimensions;
        [initialTableHeight, initialTableWidth] = [sheetDimensions.tableHeight, sheetDimensions.tableWidth];
        document.querySelector(`.AxisY.row${rowNum} > .resizer-vertical`).style.width = `${initialTableWidth}px`;
        y = e.clientY;
        h = parseInt(window.getComputedStyle(axisCell).height, 10);
        dataBeforeChange = getResizableRowData(rowNum, h, initialTableHeight); // store current state
        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
        resizer.classList.add('resizing-vertical');
    };

    // disable resizing if document.width == content.width
    const mouseMoveHandler = function (e) {
        changeOccurred = y != e.clientY ? true : false;
        const dy = h + e.clientY - y < 0 ? -h + 1 : e.clientY - y; // set dy so as to maintain 1 pixel minimum height
        updateHeights(rowNum, h, dy);
        let newTableHeight = initialTableHeight + dy;
        store.dispatch(setSheetDimensions({ tableHeight: newTableHeight, tableWidth: initialTableWidth }));
    };

    const mouseUpHandler = function () {
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
        resizer.classList.remove('resizing-vertical');
        resizer.style.width = document.querySelector('.AxisY').style.width;
        if (changeOccurred) {
            let newHeight = parseInt(axisCell.style.height, 10);
            dataAfterChange = getResizableRowData(rowNum, newHeight, store.getState().sheetDimensions.tableHeight);
            recordChange(dataBeforeChange, dataAfterChange);
            changeOccurred = false;
        }
    };

    resizer.addEventListener('mousedown', mouseDownHandler);
}

//---------------------------------------------------------------
// ----------- BASEMENT -----------------------------------------
//---------------------------------------------------------------

function setResizerDimensions(resizer, tableHeight, tableWidth) {
    if (hasClass(resizer, 'resizer-horizontal')) resizer.style.height = `${tableHeight}px`;
    else resizer.style.width = `${tableWidth}px`;
}

function getResizableColData(index, width, sheetWidth) {
    let myData = new Data();
    let groupStyleMap = new Map();
    groupStyleMap.set('width', width)
    myData.setGroup(`.col${index}`, groupStyleMap);
    let individualStyleMap = new Map();
    individualStyleMap.set('width', sheetWidth);
    myData.setIndividualEntry(`spreadsheet`, individualStyleMap);
    return myData;
}
function getResizableRowData(index, height, sheetHeight) {
    let myData = new Data();
    let groupStyleMap = new Map();
    groupStyleMap.set('height', height)
    myData.setGroup(`.row${index}`, groupStyleMap);
    let individualStyleMap = new Map();
    individualStyleMap.set('height', sheetHeight);
    myData.setIndividualEntry(`spreadsheet`, individualStyleMap);
    return myData;
}

function storeColMargins(colMarginsLeft, colNum) {
    let elem = null;
    while ((elem = document.querySelector(`.col${++colNum}`)) != null) {
        colMarginsLeft.push(parseInt(elem.style.marginLeft, 10));
    }
}

function updateHeights(rowIndex, height, dy) {
    let arr = [...document.querySelectorAll(`.row${rowIndex}`)];
    arr[1].style.lineHeight = height + dy + 'px';
    arr.forEach((cell, index) => {
        if (index > 1) {
            cell.querySelector('input').style.height = height + dy - 6 + 'px';
            cell.querySelector('.selectionLayer').style.height = height + dy + 'px';
            cell.querySelector('.highlightLayer').style.height = height + dy - 4 + 'px';
        }
        cell.style.height = height + dy + 'px';
    });
}

function updateWidths(colIndex, width, dx) {
    let arr = [...document.querySelectorAll(`.col${colIndex}`)];
    arr.forEach((cell, index) => {
        cell.style.width = width + dx + 'px';
        if (index > 0) {
            cell.querySelector('input').style.width = width + dx - 8 + 'px';
            cell.querySelector('.selectionLayer').style.width = width + dx + 'px';
            cell.querySelector('.highlightLayer').style.width = width + dx - 4 + 'px';
        }
    });
}

function updateColMargins(colIndex, colMarginsLeft, dx) {
    let idx = colIndex - 1;
    let arr = [];
    while ((arr = [...document.querySelectorAll(`.col${++idx}`)]).length != 0) {
        arr.forEach(box => box.style.marginLeft = colMarginsLeft[idx - colIndex] + dx + 'px');
    }
}

export { applyResizers, getResizableColData, getResizableRowData };