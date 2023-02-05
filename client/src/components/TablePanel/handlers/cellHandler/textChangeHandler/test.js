import { assert_store_unchanged, compareDOM, compareStore, logError, logSuccess } from '../../../../../tests/helper.js';
import { getInLine, nextTurn } from '../../../../../tests/sequenceHelpers.js'
import { store } from './../../../../../store/store.js'

const WAIT_IN_QUEUE = -1;
const ARRANGE_AND_ACTION = 0;
const ASSERT = 1;

function textChangeTest(turn) {
    let changes = [[4, 5, 'blah'], [1, 2, 'burger'], [3, 7, 'hello'], [8, 2, 'world'], [2, 4, 'apple']];
    try {
        if (changes.length > 0) checkReactionOfTextChange(1, changes[0], turn, true, changes.length);
        for (let i = 1; i < changes.length; ++i) checkReactionOfTextChange(i + 1, changes[i], turn, false, changes.length);
    } catch (e) {
        console.log('Error: checkReactionOfTextChange param error: ' + e);
        logError(null, null, null, null, e);
    }
}

function checkReactionOfTextChange(testCaseIndex, testDetails, turn, isFirstCall, totalTestCases) {
    let [selectedRowNum, selectedColNum, newText] = testDetails;
    let cellInput = document.querySelector(`.row${selectedRowNum}.col${selectedColNum} input`);
    let myTurnNumber = getInLine(turn);
    let stage = WAIT_IN_QUEUE;
    let prevText;
    let prevState;
    let prevHistoryIndex;
    let textChangeExpected;
    let timer = setInterval(() => {
        try {
            switch (stage) {
                case WAIT_IN_QUEUE:
                    if (turn.current == myTurnNumber) {
                        if (isFirstCall) console.log('\n--------TEXT CHANGE TEST--------------------');
                        stage = ARRANGE_AND_ACTION;
                    }
                    break;
                case ARRANGE_AND_ACTION:
                    let history = store.getState().history;
                    // arrange
                    prevText = cellInput.value;
                    prevState = history.changeHistory[history.changeHistoryIndex];
                    prevHistoryIndex = history.changeHistoryIndex;
                    textChangeExpected = cellInput.value != newText;

                    // action
                    cellInput.focus();
                    cellInput.value = newText;
                    if (textChangeExpected) cellInput.dispatchEvent(new Event('change'));
                    document.activeElement.blur();
                    stage = ASSERT;
                    break;
                case ASSERT:
                    let prevPropertyObj = { textValue: prevText };
                    let propertyObj = { textValue: newText };
                    compareDOM(selectedRowNum, selectedColNum, propertyObj);
                    if (!textChangeExpected) assert_store_unchanged(prevHistoryIndex);
                    else compareStore(selectedRowNum, selectedColNum, prevPropertyObj, propertyObj, prevState, prevHistoryIndex);
                    console.log('textChange affects store and DOM correctly');
                    if (testCaseIndex == totalTestCases) logSuccess('textChangeTest()', totalTestCases);
                    nextTurn(turn);
                    clearInterval(timer);
                    break;
            }
        } catch (e) {
            let errMsg = 'Err: checkReactionOfTextChange(): { testCaseIndex: ' + testCaseIndex + ' } : ' + e;
            console.log(errMsg);
            logError(errMsg);
            clearInterval(timer);
        }
    }, 200);
}

export { textChangeTest, checkReactionOfTextChange };