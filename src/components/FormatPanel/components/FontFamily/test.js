import { compareDOM, compareStore, logError, logSuccess } from '../../../../tests/helper.js';
import { getInLine, nextTurn } from '../../../../tests/sequenceHelpers.js'
import { store } from './../../../../store/store.js'
import { updateFontFamily } from './FontFamily.js';

const WAIT_IN_QUEUE = -1;
const ARRANGE = 0;
const ACTION_SELECT_CELL = 1
const ACTION_CHANGE_FONT_FAMILY = 2;
const ASSERT = 3;

function fontFamilyTest(turn) {
    let changes = [[3, 2, 'Century Gothic'], [5, 1, 'Century Gothic'], [6, 9, 'Times New Roman'], [6, 4, 'Century Gothic'], [1, 9, 'Century Gothic'], [8, 8, 'Ebrima'], [4, 5, 'Times New Roman'], [1, 2, 'Ebrima'], [3, 7, 'Century Gothic'], [8, 2, 'Times New Roman'], [2, 4, 'Times New Roman']];
    if (changes.length > 0) checkReactionOfFontFamily(1, changes[0], turn, true, changes.length);
    for (let i = 1; i < changes.length; ++i) checkReactionOfFontFamily(i + 1, changes[i], turn, false, changes.length);
}

function checkReactionOfFontFamily(testCaseIndex, testDetails, turn, isFirstCall, totalTestCases) {
    let [selectedRowNum, selectedColNum, newFontFamily] = testDetails;
    let cellValue = document.querySelector(`.row${selectedRowNum}.col${selectedColNum}>.cellValueDiv>.cellValue`);
    let myTurnNumber = getInLine(turn);
    let stage = WAIT_IN_QUEUE;
    let prevFontFamily;
    let prevState;
    let prevHistoryIndex;
    let timer = setInterval(() => {
        try {
            switch (stage) {
                case WAIT_IN_QUEUE:
                    if (turn.current == myTurnNumber) {
                        if (isFirstCall) console.log('\n--------FONT FAMILY TEST--------------------');
                        stage = ARRANGE;
                    }
                    break;
                case ARRANGE:
                    let history = store.getState().history;
                    // arrange
                    prevFontFamily = cellValue.style.fontFamily;
                    prevState = history.changeHistory[history.changeHistoryIndex];
                    prevHistoryIndex = history.changeHistoryIndex;
                case ACTION_SELECT_CELL:
                    // select cell
                    let cell = document.querySelector(`.row${selectedRowNum}.col${selectedColNum} .coverDiv`);
                    cell.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, clientX: 0 }));
                    stage = ACTION_CHANGE_FONT_FAMILY;
                    break;
                case ACTION_CHANGE_FONT_FAMILY:
                    // trigger click event on fontFamilyBtn
                    let selectionEntries = store.getState().selection.entries;
                    updateFontFamily(selectionEntries, prevFontFamily, newFontFamily);
                    stage = ASSERT;
                    break;
                case ASSERT:
                    let prevPropertyObj = { fontFamily: prevFontFamily };
                    let propertyObj = { fontFamily: newFontFamily };
                    compareDOM(selectedRowNum, selectedColNum, propertyObj);
                    compareStore(selectedRowNum, selectedColNum, prevPropertyObj, propertyObj, prevState, prevHistoryIndex);
                    console.log('fontFamily affects store and DOM correctly');
                    if (testCaseIndex == totalTestCases) logSuccess('fontFamilyTest()', totalTestCases);
                    nextTurn(turn);
                    clearInterval(timer);
                    break;
            }
        } catch (e) {
            let errMsg = 'Err: checkReactionOfFontFamily(): { testCaseIndex: ' + testCaseIndex + ', rowNum: ' + selectedRowNum + ', colNum: ' + selectedColNum + ', newFontFamily: ' + newFontFamily + ' } :\n' + e;
            console.log(errMsg);
            logError(errMsg);
            clearInterval(timer);
        }
    }, 200);
}

export { fontFamilyTest, checkReactionOfFontFamily };