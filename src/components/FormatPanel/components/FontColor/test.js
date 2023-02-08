import { compareDOM, compareStore, logError, logSuccess } from '../../../../tests/helper.js';
import { getInLine, nextTurn } from '../../../../tests/sequenceHelpers.js'
import { hexToRgb } from '../../helper.js';
import { store } from './../../../../store/store.js'
import { updateFontColor } from './FontColor.js';

const WAIT_IN_QUEUE = -1;
const ARRANGE = 0;
const ACTION_SELECT_CELL = 1
const ACTION_CHANGE_FONT_COLOR = 2;
const ASSERT = 3;

function fontColorTest(turn) {
    let changes = [[4, 5, '#ea580c'], [1, 2, '#16a34a'], [3, 7, '#1d4ed8'], [8, 2, '#c026d3'], [2, 4, '#db2777'], [5, 1, '#3b82f6'], [1, 9, '#f97316'], [6, 3, '#fef08a'], [8, 8, '#16a34a']];
    if (changes.length > 0) checkReactionOfFontColor(1, changes[0], turn, true, changes.length);
    for (let i = 1; i < changes.length; ++i) checkReactionOfFontColor(i + 1, changes[i], turn, false, changes.length);
}

function checkReactionOfFontColor(testCaseIndex, testDetails, turn, isFirstCall, totalTestCases) {
    let [selectedRowNum, selectedColNum, newFontColor] = testDetails;
    let cellValue = document.querySelector(`.row${selectedRowNum}.col${selectedColNum}>.cellValueDiv>.cellValue`);
    let myTurnNumber = getInLine(turn);
    let stage = WAIT_IN_QUEUE;
    let prevFontColor;
    let prevState;
    let prevHistoryIndex;
    let timer = setInterval(() => {
        try {
            switch (stage) {
                case WAIT_IN_QUEUE:
                    if (turn.current == myTurnNumber) {
                        if (isFirstCall) console.log('\n--------FONT COLOR TEST--------------------');
                        stage = ARRANGE;
                    }
                    break;
                case ARRANGE:
                    let history = store.getState().history;
                    // arrange
                    prevFontColor = cellValue.style.color;
                    prevState = history.changeHistory[history.changeHistoryIndex];
                    prevHistoryIndex = history.changeHistoryIndex;
                case ACTION_SELECT_CELL:
                    // select cell
                    let cell = document.querySelector(`.row${selectedRowNum}.col${selectedColNum} .coverDiv`);
                    cell.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, clientX: 0 }));
                    stage = ACTION_CHANGE_FONT_COLOR;
                    break;
                case ACTION_CHANGE_FONT_COLOR:
                    let selectionEntries = store.getState().selection.entries;
                    updateFontColor(selectionEntries, prevFontColor, newFontColor);
                    stage = ASSERT;
                    break;
                case ASSERT:
                    let prevPropertyObj = { fontColor: prevFontColor };
                    let propertyObj = { fontColor: hexToRgb(newFontColor) };
                    compareDOM(selectedRowNum, selectedColNum, propertyObj);
                    compareStore(selectedRowNum, selectedColNum, prevPropertyObj, propertyObj, prevState, prevHistoryIndex);
                    console.log('fontColor affects store and DOM correctly');
                    if (testCaseIndex == totalTestCases) logSuccess('fontColorTest()', totalTestCases);
                    nextTurn(turn);
                    clearInterval(timer);
                    break;
            }
        } catch (e) {
            let errMsg = 'Err: checkReactionOfFontColor(): { testCaseIndex: ' + testCaseIndex + ', rowNum: ' + selectedRowNum + ', colNum: ' + selectedColNum + ', newFontColor: ' + newFontColor + ' } :\n' + e;
            console.log(errMsg);
            logError(errMsg);
            clearInterval(timer);
        }
    }, 200);
}

export { fontColorTest, checkReactionOfFontColor };