import { compareDOM, compareStore, logError, logSuccess } from '../../../../tests/helper.js';
import { getInLine, nextTurn } from '../../../../tests/sequenceHelpers.js'
import { store } from './../../../../store/store.js'
import { updateHorizontalAlignment } from './HorizontalAlignment.js';

const WAIT_IN_QUEUE = -1;
const ARRANGE = 0;
const ACTION_SELECT_CELL = 1
const ACTION_CHANGE_HORIZONTAL_ALIGNMENT = 2;
const ASSERT = 3;

function horizontalAlignmentTest(turn) {
    let changes = [[4, 5, 'left'], [1, 2, 'right'], [3, 7, 'center'], [8, 2, 'left'], [2, 4, 'right']];
    if (changes.length > 0) checkReactionOfHorizontalAlignment(1, changes[0], turn, true, changes.length);
    for (let i = 1; i < changes.length; ++i) checkReactionOfHorizontalAlignment(i + 1, changes[i], turn, false, changes.length);
}

function checkReactionOfHorizontalAlignment(testCaseIndex, testDetails, turn, isFirstCall, totalTestCases) {
    let [selectedRowNum, selectedColNum, newHorizontalAlignment] = testDetails;
    let cellValue = document.querySelector(`.row${selectedRowNum}.col${selectedColNum}>.cellValueDiv>.cellValue`);
    let myTurnNumber = getInLine(turn);
    let stage = WAIT_IN_QUEUE;
    let prevHorizontalAlignment;
    let prevState;
    let prevHistoryIndex;
    let timer = setInterval(() => {
        try {
            switch (stage) {
                case WAIT_IN_QUEUE:
                    if (turn.current == myTurnNumber) {
                        if (isFirstCall) console.log('\n--------HORIZONTAL ALIGNMENT TEST--------------------');
                        stage = ARRANGE;
                    }
                    break;
                case ARRANGE:
                    let history = store.getState().history;
                    // arrange
                    prevHorizontalAlignment = cellValue.style.textAlign;
                    prevState = history.changeHistory[history.changeHistoryIndex];
                    prevHistoryIndex = history.changeHistoryIndex;
                case ACTION_SELECT_CELL:
                    // select cell
                    let cell = document.querySelector(`.row${selectedRowNum}.col${selectedColNum} .coverDiv`);
                    cell.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, clientX: 0 }));
                    stage = ACTION_CHANGE_HORIZONTAL_ALIGNMENT;
                    break;
                case ACTION_CHANGE_HORIZONTAL_ALIGNMENT:
                    let selectionEntries = store.getState().selection.entries;
                    updateHorizontalAlignment(selectionEntries, prevHorizontalAlignment, newHorizontalAlignment);
                    stage = ASSERT;
                    break;
                case ASSERT:
                    let prevPropertyObj = { horizontalAlignment: prevHorizontalAlignment };
                    let propertyObj = { horizontalAlignment: newHorizontalAlignment };
                    compareDOM(selectedRowNum, selectedColNum, propertyObj);
                    compareStore(selectedRowNum, selectedColNum, prevPropertyObj, propertyObj, prevState, prevHistoryIndex);
                    console.log(' horizontalAlignment affects store and DOM correctly');
                    if (testCaseIndex == totalTestCases) logSuccess(' horizontalAlignmentTest()', totalTestCases);
                    nextTurn(turn);
                    clearInterval(timer);
                    break;
            }
        } catch (e) {
            let errMsg = 'Err: checkReactionOfHorizontalAlignment(): { testCaseIndex: ' + testCaseIndex + ', rowNum: ' + selectedRowNum + ', colNum: ' + selectedColNum + ', newHorizontalAlignment: ' + newHorizontalAlignment + ' } :\n' + e;
            console.log(errMsg);
            logError(errMsg);
            clearInterval(timer);
        }
    }, 200);
}

export {  horizontalAlignmentTest, checkReactionOfHorizontalAlignment };