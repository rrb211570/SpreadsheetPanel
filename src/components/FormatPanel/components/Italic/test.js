import { compareDOM, compareStore, logError, logSuccess } from '../../../../tests/helper.js';
import { getInLine, nextTurn } from '../../../../tests/sequenceHelpers.js'
import { store } from './../../../../store/store.js'

const WAIT_IN_QUEUE = -1;
const ARRANGE = 0;
const ACTION_SELECT_CELL = 1;
const ACTION_TOGGLE_ITALIC = 2;
const ASSERT = 3;

function italicTest(turn) {
    let changes = [[4, 5], [6, 4], [7, 6], [3, 7], [6, 9], [5, 8], [8, 8]];
    try {
        if (changes.length > 0) checkReactionOfItalic(1, changes[0], turn, true, changes.length);
        for (let i = 1; i < changes.length; ++i) checkReactionOfItalic(i + 1, changes[i], turn, false, changes.length);
    } catch (e) {
        console.log('Error: checkReactionOfItalic param error: ' + e);
        logError(null, null, null, null, e);
    }
}

function checkReactionOfItalic(testCaseIndex, testDetails, turn, isFirstCall, totalTestCases) {
    let [selectedRowNum, selectedColNum] = testDetails;
    let cellValue = document.querySelector(`.row${selectedRowNum}.col${selectedColNum}>.cellValueDiv>.cellValue`);
    let myTurnNumber = getInLine(turn);
    let stage = WAIT_IN_QUEUE;
    let wasPreviouslyItalic;
    let prevState;
    let prevHistoryIndex;
    let timer = setInterval(() => {
        try {
            switch (stage) {
                case WAIT_IN_QUEUE:
                    if (turn.current == myTurnNumber) {
                        if (isFirstCall) console.log('\n--------ITALIC TEST--------------------');
                        stage = ARRANGE;
                    }
                    break;
                case ARRANGE:
                    let history = store.getState().history;
                    wasPreviouslyItalic = cellValue.style.fontStyle == 'italic';
                    prevState = history.changeHistory[history.changeHistoryIndex];
                    prevHistoryIndex = history.changeHistoryIndex;
                case ACTION_SELECT_CELL:
                    let cell = document.querySelector(`.row${selectedRowNum}.col${selectedColNum} .coverDiv`);
                    cell.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, clientX: 0 }));
                    stage = ACTION_TOGGLE_ITALIC;
                    break;
                case ACTION_TOGGLE_ITALIC:
                    // trigger click event on italicBtn
                    let italicBtn = document.querySelector('.italic__btn');
                    italicBtn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, clientX: 0 }));
                    stage = ASSERT;
                    break;
                case ASSERT:
                    let prevPropertyObj = { fontStyle: wasPreviouslyItalic ? 'italic' : 'normal' };
                    let propertyObj = { fontStyle: wasPreviouslyItalic ? 'normal' : 'italic' };
                    compareDOM(selectedRowNum, selectedColNum, propertyObj);
                    compareStore(selectedRowNum, selectedColNum, prevPropertyObj, propertyObj, prevState, prevHistoryIndex);
                    console.log('italic affects store and DOM correctly');
                    if (testCaseIndex == totalTestCases) logSuccess('italicTest()', totalTestCases);
                    nextTurn(turn);
                    clearInterval(timer);
                    break;
            }
        } catch (e) {
            let errMsg = 'Err: checkReactionOfItalic(): { testCaseIndex: ' + testCaseIndex + ', rowNum: ' + selectedRowNum + ', colNum: ' + selectedColNum + ', toggling italic: ' + wasPreviouslyItalic ? 'off' : 'on' + ' } : ' + e;
            console.log(errMsg);
            logError(errMsg);
            clearInterval(timer);
        }
    }, 200);
}

export { italicTest, checkReactionOfItalic };