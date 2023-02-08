import { compareDOM, compareStore, logError, logSuccess } from '../../../../tests/helper.js';
import { getInLine, nextTurn } from '../../../../tests/sequenceHelpers.js'
import { store } from './../../../../store/store.js'

const WAIT_IN_QUEUE = -1;
const ARRANGE = 0;
const ACTION_SELECT_CELL = 1;
const ACTION_TOGGLE_STRIKETHROUGH = 2;
const ASSERT = 3;

function strikethroughTest(turn) {
    let changes = [[4, 5], [5, 1], [4, 3], [6, 3], [6, 4], [7, 6], [8, 2]];
    try {
        if (changes.length > 0) checkReactionOfStrikethrough(1, changes[0], turn, true, changes.length);
        for (let i = 1; i < changes.length; ++i) checkReactionOfStrikethrough(i + 1, changes[i], turn, false, changes.length);
    } catch (e) {
        console.log('Error: checkReactionOfstrikethrough param error: ' + e);
        logError(null, null, null, null, e);
    }
}

function checkReactionOfStrikethrough(testCaseIndex, testDetails, turn, isFirstCall, totalTestCases) {
    let [selectedRowNum, selectedColNum] = testDetails;
    let cellValue = document.querySelector(`.row${selectedRowNum}.col${selectedColNum}>.cellValueDiv>.cellValue`);
    let myTurnNumber = getInLine(turn);
    let stage = WAIT_IN_QUEUE;
    let wasPreviouslyStrikethrough;
    let prevState;
    let prevHistoryIndex;
    let timer = setInterval(() => {
        try {
            switch (stage) {
                case WAIT_IN_QUEUE:
                    if (turn.current == myTurnNumber) {
                        if (isFirstCall) console.log('\n--------STRIKETHROUGH TEST--------------------');
                        stage = ARRANGE;
                    }
                    break;
                case ARRANGE:
                    let history = store.getState().history;
                    wasPreviouslyStrikethrough = cellValue.style.textDecoration == 'line-through';
                    prevState = history.changeHistory[history.changeHistoryIndex];
                    prevHistoryIndex = history.changeHistoryIndex;
                case ACTION_SELECT_CELL:
                    let cell = document.querySelector(`.row${selectedRowNum}.col${selectedColNum} .coverDiv`);
                    cell.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, clientX: 0 }));
                    stage = ACTION_TOGGLE_STRIKETHROUGH;
                    break;
                case ACTION_TOGGLE_STRIKETHROUGH:
                    // trigger click event on strikethroughBtn
                    let strikethroughBtn = document.querySelector('.strikethrough__btn');
                    strikethroughBtn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, clientX: 0 }));
                    stage = ASSERT;
                    break;
                case ASSERT:
                    let prevPropertyObj = { textDecoration: wasPreviouslyStrikethrough ? 'line-through' : 'none' };
                    let propertyObj = { textDecoration: wasPreviouslyStrikethrough ? 'none' : 'line-through' };
                    compareDOM(selectedRowNum, selectedColNum, propertyObj);
                    compareStore(selectedRowNum, selectedColNum, prevPropertyObj, propertyObj, prevState, prevHistoryIndex);
                    console.log('strikethrough affects store and DOM correctly');
                    if (testCaseIndex == totalTestCases) logSuccess('strikethroughTest()', totalTestCases);
                    nextTurn(turn);
                    clearInterval(timer);
                    break;
            }
        } catch (e) {
            let errMsg = 'Err: checkReactionOfStrikethrough(): { testCaseIndex: ' + testCaseIndex + ', rowNum: ' + selectedRowNum + ', colNum: ' + selectedColNum + ', toggling strikethrough: ' + wasPreviouslyStrikethrough ? 'off' : 'on' + ' } : ' + e;
            console.log(errMsg);
            logError(errMsg);
            clearInterval(timer);
        }
    }, 200);
}

export { strikethroughTest, checkReactionOfStrikethrough };