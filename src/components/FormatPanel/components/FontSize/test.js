import { compareDOM, compareStore, logError, logSuccess } from '../../../../tests/helper.js';
import { getInLine, nextTurn } from '../../../../tests/sequenceHelpers.js'
import { store } from './../../../../store/store.js'
import { updateFontSize } from './FontSize.js';

const WAIT_IN_QUEUE = -1;
const ARRANGE = 0;
const ACTION_SELECT_CELL = 1
const ACTION_CHANGE_FONT_SIZE = 2;
const ASSERT = 3;

function fontSizeTest(turn) {
    let changes = [[4, 5, 18], [1, 2, 24], [3, 7, 18], [8, 2, 24], [2, 4, 18], [5, 1, 36], [8, 8, 24]];
    if (changes.length > 0) checkReactionOfFontSize(1, changes[0], turn, true, changes.length);
    for (let i = 1; i < changes.length; ++i) checkReactionOfFontSize(i + 1, changes[i], turn, false, changes.length);
}

function checkReactionOfFontSize(testCaseIndex, testDetails, turn, isFirstCall, totalTestCases) {
    let [selectedRowNum, selectedColNum, newFontSize] = testDetails;
    let cellValue = document.querySelector(`.row${selectedRowNum}.col${selectedColNum}>.cellValueDiv>.cellValue`);
    let myTurnNumber = getInLine(turn);
    let stage = WAIT_IN_QUEUE;
    let prevFontSize;
    let prevState;
    let prevHistoryIndex;
    let timer = setInterval(() => {
        try {
            switch (stage) {
                case WAIT_IN_QUEUE:
                    if (turn.current == myTurnNumber) {
                        if (isFirstCall) console.log('\n--------FONT SIZE TEST--------------------');
                        stage = ARRANGE;
                    }
                    break;
                case ARRANGE:
                    let history = store.getState().history;
                    // arrange
                    prevFontSize = cellValue.style.fontSize != '' ? cellValue.style.fontSize : '12px';
                    prevState = history.changeHistory[history.changeHistoryIndex];
                    prevHistoryIndex = history.changeHistoryIndex;
                case ACTION_SELECT_CELL:
                    // select cell
                    let cell = document.querySelector(`.row${selectedRowNum}.col${selectedColNum} .coverDiv`);
                    cell.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, clientX: 0 }));
                    stage = ACTION_CHANGE_FONT_SIZE;
                    break;
                case ACTION_CHANGE_FONT_SIZE:
                    let selectionEntries = store.getState().selection.entries;
                    updateFontSize(selectionEntries, parseInt(prevFontSize, 10), parseInt(newFontSize, 10));
                    stage = ASSERT;
                    break;
                case ASSERT:
                    let prevPropertyObj = { fontSize: parseInt(prevFontSize, 10) };
                    let propertyObj = { fontSize: newFontSize };
                    compareDOM(selectedRowNum, selectedColNum, propertyObj);
                    compareStore(selectedRowNum, selectedColNum, prevPropertyObj, propertyObj, prevState, prevHistoryIndex);
                    console.log('fontSize affects store and DOM correctly');
                    if (testCaseIndex == totalTestCases) logSuccess('fontSizeTest()', totalTestCases);
                    nextTurn(turn);
                    clearInterval(timer);
                    break;
            }
        } catch (e) {
            let errMsg = 'Err: checkReactionOfFontSize(): { testCaseIndex: ' + testCaseIndex + ', rowNum: ' + selectedRowNum + ', colNum: ' + selectedColNum + ', newFontSize: ' + newFontSize + ' } :\n' + e;
            console.log(errMsg);
            logError(errMsg);
            clearInterval(timer);
        }
    }, 200);
}

export { fontSizeTest, checkReactionOfFontSize };