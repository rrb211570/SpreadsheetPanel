import { store } from '../../../../store/store.js';

const SCROLL_BAR_ENDPOINT_DELTA = 22 * 4;
let curRow = 1;
let curCol = 1;
let lowestPixel;
let rightMostPixel;
let pseudoMarginTops;

function applyScrollSnapHandlers() {
    updateScrollDimensions();
    document.querySelector('#tableEntryCellsWindow').onwheel = function () { return false; }
    document.querySelector('#tableEntryCellsWindow').addEventListener('scroll', scrollHandler);
    document.querySelector('#tableEntryCells').addEventListener('wheel', wheelHandler);
    window.history.scrollRestoration = 'manual'; // scroll should reset on page reload
}

function updateScrollDimensions() {
    let tableEntryCellsWindow = document.querySelector('#tableEntryCellsWindow');
    let tableEntryCells = document.querySelector('#tableEntryCells');

    let parentDivHeight = parseInt(tableEntryCellsWindow.offsetHeight, 10);
    let parentDivWidth = parseInt(tableEntryCellsWindow.offsetWidth, 10);
    let tableHeight = parseInt(tableEntryCells.scrollHeight, 10);
    let tableWidth = parseInt(tableEntryCells.scrollWidth, 10);
    let totalRows = store.getState().tableDimensions.totalRows;
    pseudoMarginTops = [0];
    for (let i = 1; i < totalRows; ++i) {
        pseudoMarginTops.push(parseInt(pseudoMarginTops[i - 1], 10) + parseInt(document.querySelector(`#row${i}`).style.height, 10));
    }

    lowestPixel = tableHeight - parentDivHeight + 23;
    rightMostPixel = tableWidth - parentDivWidth + 50 - 18 - 18 + 4;
    //console.log(lowestPixel + ' ' + rightMostPixel);
}

function scrollHandler() {
    let scrollBarLayer = document.querySelector('#tableEntryCellsWindow');
    let newPosX = scrollBarLayer.scrollLeft;
    let newPosY = scrollBarLayer.scrollTop;

    while (newPosY > pseudoMarginTops[curRow]) ++curRow;
    while (newPosY < pseudoMarginTops[curRow - 1]) --curRow;

    if (newPosY > lowestPixel) newPosY = lowestPixel;
    else newPosY = pseudoMarginTops[curRow - 1];

    while (newPosX > getMarginLeft(curCol + 1)) ++curCol;
    while (newPosX < getMarginLeft(curCol)) --curCol;

    // console.log(newPosX + ' ' + rightMostPixel + ' ' + SCROLL_BAR_ENDPOINT_DELTA);
    if (newPosX > rightMostPixel - SCROLL_BAR_ENDPOINT_DELTA) newPosX = rightMostPixel;
    else newPosX = getMarginLeft(curCol);

    //console.log('Scroll');
    //console.log('Scroll > curRow: ' + curRow + ' curCol: ' + curCol + ' newPosX: ' + newPosX + ' newPosY: ' + newPosY);
    updateTablePosition(newPosX, newPosY);
}

function getMarginLeft(curCol) {
    let totalCols = store.getState().tableDimensions.totalCols;
    return parseInt(document.querySelector(`.row1.col${curCol < totalCols ? curCol : totalCols}`).style.marginLeft, 10);
}

let scrollTimeout = null;
function wheelHandler(event) {
    let totalRows = store.getState().tableDimensions.totalRows;
    let totalCols = store.getState().tableDimensions.totalCols;
    let newPosX;
    let newPosY;

    if (event.deltaY > 0) {
        if (event.shiftKey) {
            let nextColCell = document.querySelector(`.row${curRow}.col${curCol < 16 ? curCol + 1 : 16}`);
            newPosX = parseInt(nextColCell.style.marginLeft, 10);
            if (newPosX > rightMostPixel - SCROLL_BAR_ENDPOINT_DELTA) {
                newPosX = rightMostPixel;
            }
            else if (curCol < totalCols) ++curCol;
        } else {
            newPosY = pseudoMarginTops[curRow < totalRows ? curRow : curRow - 1];
            if (newPosY > lowestPixel) newPosY = lowestPixel;
            else if (curRow < totalRows) ++curRow;
        }
    } else {
        if (event.shiftKey) {
            let prevColCell = document.querySelector(`.row${curRow}.col${curCol > 1 ? curCol - 1 : 1}`);
            newPosX = parseInt(prevColCell.style.marginLeft, 10);
            if (newPosX < SCROLL_BAR_ENDPOINT_DELTA) newPosX = 0;
            else if (curCol > 1) --curCol;
        } else {
            newPosY = pseudoMarginTops[curRow > 1 ? curRow - 2 : curRow - 1];
            if (newPosY > lowestPixel) newPosY = lowestPixel;
            else if (curRow > 1) --curRow;
        }
    }

    // Since we're already scrolling via wheel event, we wrap tableEntryCellsWindow with logic that cancels scroll event
    document.querySelector('#tableEntryCellsWindow').removeEventListener('scroll', scrollHandler);
    document.querySelector('#tableEntryCellsWindow').scroll({
        top: newPosY,
        left: newPosX,
        behavior: 'auto'
    });
    if (scrollTimeout) clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        document.querySelector('#tableEntryCellsWindow').addEventListener('scroll', scrollHandler);
    }, 500);

    console.log('Wheel');
    //console.log('Wheel > curRow: ' + curRow + ' curCol: ' + curCol + ' newPosX: ' + newPosX + ' newPosY: ' + newPosY);
    updateTablePosition(newPosX, newPosY);
}

function updateTablePosition(newPosX, newPosY) {
    document.querySelector('#axisY').style.marginTop = 22 - newPosY + 'px';
    document.querySelector('#axisX').style.marginLeft = 50 - newPosX  + 'px';
    document.querySelector('#tableEntryCells').scroll({
        top: newPosY,
        left: newPosX,
        behavior: 'auto'
    });
}

export { applyScrollSnapHandlers, updateScrollDimensions };