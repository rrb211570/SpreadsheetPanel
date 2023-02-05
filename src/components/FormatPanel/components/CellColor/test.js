import { compareDOM, compareStore, logError, logSuccess } from '../../../../tests/helper.js';
import { getInLine, nextTurn } from '../../../../tests/sequenceHelpers.js'
import { hexToRgb } from '../../helper.js';
import { store } from './../../../../store/store.js'
import { updateCellColor } from './CellColor.js';

const WAIT_IN_QUEUE = -1;
const ARRANGE = 0;
const ACTION_SELECT_CELL = 1
const ACTION_CHANGE_CELL_COLOR = 2;
const ASSERT = 3;

function cellColorTest(turn) {
    let changes = [[4, 5, '#f9a8d4'], [1, 2, '#d8b4fe'], [3, 7, '#bbf7d0'], [8, 2, '#fef08a'], [2, 4, '#cbd5e1']];
    if (changes.length > 0) checkReactionOfCellColor(1, changes[0], turn, true, changes.length);
    for (let i = 1; i < changes.length; ++i) checkReactionOfCellColor(i + 1, changes[i], turn, false, changes.length);
}

function checkReactionOfCellColor(testCaseIndex, testDetails, turn, isFirstCall, totalTestCases) {
    let [selectedRowNum, selectedColNum, newCellColor] = testDetails;
    let cellValueDiv = document.querySelector(`.row${selectedRowNum}.col${selectedColNum}>.cellValueDiv>.cellValue`);
    let myTurnNumber = getInLine(turn);
    let stage = WAIT_IN_QUEUE;
    let prevCellColor;
    let prevState;
    let prevHistoryIndex;
    let timer = setInterval(() => {
        try {
            switch (stage) {
                case WAIT_IN_QUEUE:
                    if (turn.current == myTurnNumber) {
                        if (isFirstCall) console.log('\n--------CELL COLOR TEST--------------------');
                        stage = ARRANGE;
                    }
                    break;
                case ARRANGE:
                    let history = store.getState().history;
                    // arrange
                    prevCellColor = cellValueDiv.style.backgroundColor;
                    prevState = history.changeHistory[history.changeHistoryIndex];
                    prevHistoryIndex = history.changeHistoryIndex;
                case ACTION_SELECT_CELL:
                    // select cell
                    let cell = document.querySelector(`.row${selectedRowNum}.col${selectedColNum} .coverDiv`);
                    cell.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, clientX: 0 }));
                    stage = ACTION_CHANGE_CELL_COLOR;
                    break;
                case ACTION_CHANGE_CELL_COLOR:
                    let selectionEntries = store.getState().selection.entries;
                    updateCellColor(selectionEntries, prevCellColor, newCellColor);
                    stage = ASSERT;
                    break;
                case ASSERT:
                    let prevPropertyObj = { cellColor: prevCellColor };
                    let propertyObj = { cellColor: hexToRgb(newCellColor) };
                    compareDOM(selectedRowNum, selectedColNum, propertyObj);
                    compareStore(selectedRowNum, selectedColNum, prevPropertyObj, propertyObj, prevState, prevHistoryIndex);
                    console.log('cellColor affects store and DOM correctly');
                    if (testCaseIndex == totalTestCases) logSuccess('cellColorTest()', totalTestCases);
                    nextTurn(turn);
                    clearInterval(timer);
                    break;
            }
        } catch (e) {
            let errMsg = 'Err: checkReactionOfCellColor(): { testCaseIndex: ' + testCaseIndex + ', rowNum: ' + selectedRowNum + ', colNum: ' + selectedColNum + ', newCellColor: ' + newCellColor + ' } :\n' + e;
            console.log(errMsg);
            logError(errMsg);
            clearInterval(timer);
        }
    }, 200);
}

export { cellColorTest, checkReactionOfCellColor };