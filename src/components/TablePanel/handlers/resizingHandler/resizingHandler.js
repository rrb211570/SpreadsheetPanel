import Data from '../../../../data/data.js';
import { hasClass } from '../../../../misc/util.js'
import recordChange from '../../../../data/modifiers/recordChange.js';
import { store } from './../../../../store/store.js'
import { setTableDimensions } from '../../../../store/reducers/tableDimensionsSlice.js'
import { updateScrollDimensions } from '../scrollSnapHandler/scrollSnapHandler.js';

function applyResizers() {
    fixResizers('AxisX');
    fixResizers('AxisY');
}

function fixResizers(axis) {
    const axisEntries = [...document.querySelectorAll('.' + axis)]
    axisEntries.forEach(axisCell => {
        let resizer = axisCell.querySelector('div');
        setResizerDimensions(resizer, parseInt(axisCell.style.height, 10), parseInt(axisCell.style.width, 10));
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
        let tableDimensions = store.getState().tableDimensions;
        [initialTableHeight, initialTableWidth] = [tableDimensions.height, tableDimensions.width];
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
        store.dispatch(setTableDimensions({ height: initialTableHeight, width: newTableWidth }));
    };

    const mouseUpHandler = function () {
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
        resizer.classList.remove('resizing-horizontal');
        resizer.style.height = document.querySelector('.AxisX').style.height;
        if (changeOccurred) {
            let newWidth = parseInt(axisCell.style.width, 10);
            dataAfterChange = getResizableColData(colNum, newWidth, store.getState().tableDimensions.width)
            recordChange(dataBeforeChange, dataAfterChange);
            changeOccurred = false;
        }
        colMarginsLeft = [];
        document.querySelector('#scrollBarLayer').style.width = store.getState().tableDimensions.width - 50 + 'px';
        updateScrollDimensions();
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
        let tableDimensions = store.getState().tableDimensions;
        [initialTableHeight, initialTableWidth] = [tableDimensions.height, tableDimensions.width];
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
        store.dispatch(setTableDimensions({ height: newTableHeight, width: initialTableWidth }));
    };

    const mouseUpHandler = function () {
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
        resizer.classList.remove('resizing-vertical');
        resizer.style.width = document.querySelector('.AxisY').style.width;
        if (changeOccurred) {
            let newHeight = parseInt(axisCell.style.height, 10);
            dataAfterChange = getResizableRowData(rowNum, newHeight, store.getState().tableDimensions.height);
            recordChange(dataBeforeChange, dataAfterChange);
            changeOccurred = false;
        }
        document.querySelector('#scrollBarLayer').style.height = store.getState().tableDimensions.height - 22 + 'px';
        updateScrollDimensions();
    };

    resizer.addEventListener('mousedown', mouseDownHandler);
}

//---------------------------------------------------------------
// ----------- BASEMENT -----------------------------------------
//---------------------------------------------------------------

function setResizerDimensions(resizer, cellHeight, cellWidth) {
    if (hasClass(resizer, 'resizer-horizontal')) resizer.style.height = `${cellHeight}px`;
    else resizer.style.width = `${cellWidth}px`;
}

function getResizableColData(index, width, tableWidth) {
    let myData = new Data();
    let groupStyleMap = new Map();
    groupStyleMap.set('width', width)
    myData.setGroup(`.col${index}`, groupStyleMap);
    let individualStyleMap = new Map();
    individualStyleMap.set('width', tableWidth);
    myData.setIndividualEntry(`table`, individualStyleMap);
    return myData;
}
function getResizableRowData(index, height, tableHeight) {
    let myData = new Data();
    let groupStyleMap = new Map();
    groupStyleMap.set('height', height)
    myData.setGroup(`.row${index}`, groupStyleMap);
    let individualStyleMap = new Map();
    individualStyleMap.set('height', tableHeight);
    myData.setIndividualEntry(`table`, individualStyleMap);
    return myData;
}

function storeColMargins(colMarginsLeft, colNum) {
    let elem = null;
    while ((elem = document.querySelector(`.row1.col${++colNum}`)) != null) {
        colMarginsLeft.push(parseInt(elem.style.marginLeft, 10));
    }
}

function updateHeights(rowIndex, height, dy) {
    let arr = [...document.querySelectorAll(`.row${rowIndex}`)];
    arr[1].style.lineHeight = height + dy + 'px';
    arr.forEach((cell, index) => {
        if (index > 1) {
            cell.querySelector('.coverDiv').style.height = height + dy + 'px';
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
            cell.querySelector('.coverDiv').style.width = width + dx + 'px';
        }
    });
}

function updateColMargins(colIndex, colMarginsLeft, dx) {
    let idx = colIndex - 1;
    let arr = [];
    while ((arr = [...document.querySelectorAll(`.col${++idx}`)]).length != 0) {
        arr.forEach(box => {
            if (box.classList.contains('AxisX')) box.style.marginLeft = colMarginsLeft[idx - colIndex] + dx + 'px';
            else box.style.marginLeft = colMarginsLeft[idx - colIndex] + dx + 'px';
        });
    }
}

export { applyResizers, getResizableColData, getResizableRowData };