import { compareDOM, compareStore, logError, logSuccess } from '../../../../tests/helper.js';
import { getInLine, nextTurn } from '../../../../tests/sequenceHelpers.js'
import { store } from '../../../../store/store.js'

const WAIT_IN_QUEUE = -1;
const ARRANGE = 0;
const ACTION_SELECT_CELL = 1
const ACTION_TOGGLE_BOLD = 2;
const ASSERT = 3;

function boldTest(turn) {
    let changes = [[4, 5], [1, 2], [3, 2], [4, 3], [2, 4]];
    try {
        if (changes.length > 0) checkReactionOfBold(1, changes[0], turn, true, changes.length);
        for (let i = 1; i < changes.length; ++i) checkReactionOfBold(i + 1, changes[i], turn, false, changes.length);
    } catch (e) {
        console.log('Error: checkReactionOfBold param error: ' + e);
        logError(null, null, null, null, e);
    }
}

function checkReactionOfBold(testCaseIndex, testDetails, turn, isFirstCall, totalTestCases) {
    let [selectedRowNum, selectedColNum] = testDetails;
    let cellValue = document.querySelector(`.row${selectedRowNum}.col${selectedColNum}>.cellValueDiv>.cellValue`);
    let myTurnNumber = getInLine(turn);
    let stage = WAIT_IN_QUEUE;
    let wasPreviouslyBold;
    let prevState;
    let prevHistoryIndex;
    let timer = setInterval(() => {
        try {
            switch (stage) {
                case WAIT_IN_QUEUE:
                    if (turn.current == myTurnNumber) {
                        if (isFirstCall) console.log('\n--------BOLD TEST--------------------');
                        stage = ARRANGE;
                    }
                    break;
                case ARRANGE:
                    let history = store.getState().history;
                    wasPreviouslyBold = cellValue.style.fontWeight == 700;
                    prevState = history.changeHistory[history.changeHistoryIndex];
                    prevHistoryIndex = history.changeHistoryIndex;
                case ACTION_SELECT_CELL:
                    let cell = document.querySelector(`.row${selectedRowNum}.col${selectedColNum} .coverDiv`);
                    cell.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, clientX: 0 }));
                    stage = ACTION_TOGGLE_BOLD;
                    break;
                case ACTION_TOGGLE_BOLD:
                    let boldBtn = document.querySelector('.bold__btn');
                    boldBtn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, clientX: 0 }));
                    stage = ASSERT;
                    break;
                case ASSERT:
                    let prevPropertyObj = { fontWeight: wasPreviouslyBold ? 700 : 400 };
                    let propertyObj = { fontWeight: wasPreviouslyBold ? 400 : 700 };
                    compareDOM(selectedRowNum, selectedColNum, propertyObj);
                    compareStore(selectedRowNum, selectedColNum, prevPropertyObj, propertyObj, prevState, prevHistoryIndex);
                    console.log('bold affects store and DOM correctly');
                    if (testCaseIndex == totalTestCases) logSuccess('boldTest()', totalTestCases);
                    nextTurn(turn);
                    clearInterval(timer);
                    break;
            }
        } catch (e) {
            let errMsg = 'Err: checkReactionOfBold(): { testCaseIndex: ' + testCaseIndex + ', rowNum: ' + selectedRowNum + ', colNum: ' + selectedColNum + ', toggling bold: ' + (wasPreviouslyBold ? 'off' : 'on') + ' } : ' + e;
            console.log(errMsg);
            logError(errMsg);
            clearInterval(timer);
        }
    }, 200);
}

export { boldTest, checkReactionOfBold };