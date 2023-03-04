import { compareDOM, compareStore, logError, logSuccess } from '../../../../tests/helper.js';
import { getInLine, nextTurn } from '../../../../tests/sequenceHelpers.js'
import { store } from '../../../../store/store.js'
import { parseVerticalAlignment, updateVerticalAlignment } from './VerticalAlignment.js';

const WAIT_IN_QUEUE = -1;
const ARRANGE = 0;
const ACTION_SELECT_CELL = 1
const ACTION_CHANGE_VERTICAL_ALIGNMENT = 2;
const ASSERT = 3;

function verticalAlignmentTest(turn) {
    let changes = [[4, 5, 'top'], [1, 2, 'bottom'], [3, 7, 'bottom'], [8, 2, 'top'], [2, 4, 'bottom'], [5, 8, 'top'], [3, 2, 'bottom']];
    if (changes.length > 0) checkReactionOfVerticalAlignment(1, changes[0], turn, true, changes.length);
    for (let i = 1; i < changes.length; ++i) checkReactionOfVerticalAlignment(i + 1, changes[i], turn, false, changes.length);
}

function checkReactionOfVerticalAlignment(testCaseIndex, testDetails, turn, isFirstCall, totalTestCases) {
    let [selectedRowNum, selectedColNum, newVerticalAlignment] = testDetails;
    let cellValueDiv = document.querySelector(`.row${selectedRowNum}.col${selectedColNum}>.cellValueDiv`);
    let myTurnNumber = getInLine(turn);
    let stage = WAIT_IN_QUEUE;
    let prevVerticalAlignment;
    let prevState;
    let prevHistoryIndex;
    let timer = setInterval(() => {
        try {
            switch (stage) {
                case WAIT_IN_QUEUE:
                    if (turn.current == myTurnNumber) {
                        if (isFirstCall) console.log('\n--------VERTICAL ALIGNMENT TEST--------------------');
                        stage = ARRANGE;
                    }
                    break;
                case ARRANGE:
                    let history = store.getState().history;
                    // arrange
                    prevVerticalAlignment = cellValueDiv.style.justifyContent == '' ? 'center' : cellValueDiv.style.justifyContent;
                    prevState = history.changeHistory[history.changeHistoryIndex];
                    prevHistoryIndex = history.changeHistoryIndex;
                case ACTION_SELECT_CELL:
                    // select cell
                    let cell = document.querySelector(`.row${selectedRowNum}.col${selectedColNum} .coverDiv`);
                    cell.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, clientX: 0 }));
                    stage = ACTION_CHANGE_VERTICAL_ALIGNMENT;
                    break;
                case ACTION_CHANGE_VERTICAL_ALIGNMENT:
                    let selectionEntries = store.getState().selection.entries;
                    updateVerticalAlignment(selectionEntries, prevVerticalAlignment, newVerticalAlignment);
                    stage = ASSERT;
                    break;
                case ASSERT:
                    let prevPropertyObj = { verticalAlignment: prevVerticalAlignment };
                    let propertyObj = { verticalAlignment: newVerticalAlignment };
                    let propertyObjDOM = { verticalAlignment: parseVerticalAlignment(newVerticalAlignment) };
                    compareDOM(selectedRowNum, selectedColNum, propertyObjDOM);
                    compareStore(selectedRowNum, selectedColNum, prevPropertyObj, propertyObj, prevState, prevHistoryIndex);
                    console.log(' verticalAlignment affects store and DOM correctly');
                    if (testCaseIndex == totalTestCases) logSuccess('verticalAlignmentTest()', totalTestCases);
                    nextTurn(turn);
                    clearInterval(timer);
                    break;
            }
        } catch (e) {
            let errMsg = 'Err: checkReactionOfVerticalAlignment(): { testCaseIndex: ' + testCaseIndex + ', rowNum: ' + selectedRowNum + ', colNum: ' + selectedColNum + ', newVerticalAlignment: ' + newVerticalAlignment + ' } :\n' + e;
            console.log(errMsg);
            logError(errMsg);
            clearInterval(timer);
        }
    }, 200);
}

export { verticalAlignmentTest, checkReactionOfVerticalAlignment };