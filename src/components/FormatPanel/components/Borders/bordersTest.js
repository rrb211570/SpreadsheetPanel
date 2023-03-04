import { compareDOM, compareStore, logError, logSuccess } from '../../../../tests/helper.js';
import { getInLine, nextTurn } from '../../../../tests/sequenceHelpers.js'
import { parseBoxShadow } from '../../../TablePanel/handlers/cellHandler/selectionHandler/selectionHandler.js';
import { store } from '../../../../store/store.js'
import { translateToBoxShadows, updateBorders } from './Borders.js';

const WAIT_IN_QUEUE = -1;
const ARRANGE = 0;
const ACTION_SELECT_CELL = 1
const ACTION_CHANGE_BORDERS = 2;
const ASSERT = 3;

function bordersTest(turn) {
    let changes = [[4, 5, 'top'], [1, 2, 'right'], [3, 7, 'bottom'], [8, 2, 'left'], [2, 4, 'top'], [1, 6, 'left'], [5, 1, 'bottom'], [7, 6, 'left'], [6, 3, 'right'], [3, 7, 'top'], [1, 2, 'left'], [3, 7, 'none']];
    if (changes.length > 0) checkReactionOfBorders(1, changes[0], turn, true, changes.length);
    for (let i = 1; i < changes.length; ++i) checkReactionOfBorders(i + 1, changes[i], turn, false, changes.length);
}

function checkReactionOfBorders(testCaseIndex, testDetails, turn, isFirstCall, totalTestCases) {
    let [selectedRowNum, selectedColNum, newBorders] = testDetails;
    let cellValueDiv = document.querySelector(`.row${selectedRowNum}.col${selectedColNum}>.cellValueDiv`);
    let myTurnNumber = getInLine(turn);
    let stage = WAIT_IN_QUEUE;
    let prevBorders;
    let prevState;
    let prevHistoryIndex;
    let timer = setInterval(() => {
        try {
            switch (stage) {
                case WAIT_IN_QUEUE:
                    if (turn.current == myTurnNumber) {
                        if (isFirstCall) console.log('\n--------BORDERS TEST--------------------');
                        stage = ARRANGE;
                    }
                    break;
                case ARRANGE:
                    let history = store.getState().history;
                    // arrange
                    prevBorders = parseBoxShadow(cellValueDiv.style.boxShadow);
                    prevState = history.changeHistory[history.changeHistoryIndex];
                    prevHistoryIndex = history.changeHistoryIndex;
                case ACTION_SELECT_CELL:
                    // select cell
                    let cell = document.querySelector(`.row${selectedRowNum}.col${selectedColNum} .coverDiv`);
                    cell.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, clientX: 0 }));
                    stage = ACTION_CHANGE_BORDERS;
                    break;
                case ACTION_CHANGE_BORDERS:
                    let selectionEntries = store.getState().selection.entries;
                    updateBorders(selectionEntries, prevBorders, newBorders);
                    stage = ASSERT;
                    break;
                case ASSERT:
                    let prevPropertyObj = { borders: prevBorders };
                    let propertyObj = { borders: newBorders };
                    let propertyObjDOM = { borders: translateToBoxShadows([newBorders]) };
                    compareDOM(selectedRowNum, selectedColNum, propertyObjDOM);
                    compareStore(selectedRowNum, selectedColNum, prevPropertyObj, propertyObj, prevState, prevHistoryIndex);
                    console.log('borders affects store and DOM correctly');
                    if (testCaseIndex == totalTestCases) logSuccess('bordersTest()', totalTestCases);
                    nextTurn(turn);
                    clearInterval(timer);
                    break;
            }
        } catch (e) {
            let errMsg = 'Err: checkReactionOfBorders(): { testCaseIndex: ' + testCaseIndex + ', rowNum: ' + selectedRowNum + ', colNum: ' + selectedColNum + ', newBorders: ' + newBorders + ' } :\n' + e;
            console.log(errMsg);
            logError(errMsg);
            clearInterval(timer);
        }
    }, 200);
}

export { bordersTest, checkReactionOfBorders };