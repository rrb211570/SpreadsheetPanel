import { getInLine, nextTurn } from '../../../../tests/sequenceHelpers.js'
import { store } from './../../../../store/store.js'

const WAIT_IN_QUEUE = -1;
const ARRANGE_AND_ACTION = 0;
const ASSERT = 1;

function textChangeTest(turn) {
    try {
        checkReactionOfTextChange(4, 5, 'blah', turn, true);
        checkReactionOfTextChange(1, 1, 'burger', turn);
        checkReactionOfTextChange(3, 7, 'hello', turn);
        checkReactionOfTextChange(8, 2, 'world', turn);
        checkReactionOfTextChange(2, 4, 'apple', turn);
    } catch (e) {
        console.log('Error: ' + e);
    }
}

function checkReactionOfTextChange(rowNum, colNum, newText, turn, isFirstCall) {
    let cellInput = document.querySelector(`.row${rowNum}.col${colNum} input`);
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
                    compareStoreAndDOM(rowNum, colNum, cellInput, prevText, newText, prevState, prevHistoryIndex, textChangeExpected);
                    console.log('textChange affects store and DOM correctly');
                    nextTurn(turn);
                    clearInterval(timer);
                    break;
            }
        } catch (e) {
            console.log('checkReactionOfTextChange(): ' + e);
            clearInterval(timer);
        }
    }, 200);
}

function compareStoreAndDOM(rowNum, colNum, cellInput, prevText, newText, prevState, prevHistoryIndex, textChangeExpected) {
    let history = store.getState().history;
    if (!textChangeExpected) {
        if (history.changeHistoryIndex != prevHistoryIndex) throw 'compareStoreAndDOM(): newState should not be created if text value did not change';
        return;
    }

    if (cellInput.value != newText) throw 'compareStoreAndDOM(): cellInput did not change to new value';

    // compare store
    if (prevHistoryIndex != history.changeHistoryIndex - 1) throw 'compareStoreAndDOM(): changeHistoryIndex not incremented correctly after event: ' + prevHistoryIndex + ' ' + history.changeHistoryIndex;
    let updatedPrevState = history.changeHistory[history.changeHistoryIndex - 1];
    let currentState = history.changeHistory[history.changeHistoryIndex];

    // check that styleMap's from prevState are merged without alteration into updatedPrevState
    for (const [entryKey, data] of prevState.getIndividualEntries()) {
        if (entryKey == 'spreadsheet') {
            let prevStyleMap = data.getStyleMap();
            let updatedPrevStyleMap = updatedPrevState.getIndividualEntry(entryKey).getStyleMap();
            if (prevStyleMap.size != updatedPrevStyleMap.size) throw 'compareStoreAndDOM(): styleMap of entryKey: \'spreadsheet\' should not be changed from textEvent';
            for (const [prop, val] of updatedPrevStyleMap.entries()) {
                if (prevStyleMap.get(prop) != val) throw 'compareStoreAndDOM(): styleMap of entryKey: \'spreadsheet\' should not be changed from textEvent';
            }
        }
        // Check that text values for all recorded cells merged correctly into updatedPrevState (only target cell may see a change in input value).
        if (entryKey != 'spreadsheet' && entryKey.match(/\.row\d+\.col\d+$/)) {
            let match = entryKey.match(/\.row(\d+)\.col(\d+)/);
            let [entryRowNum, entryColNum] = [match[1], match[2]];
            let updatedPrevText = updatedPrevState.getIndividualEntry(entryKey).getVal();
            if (entryRowNum != rowNum && entryColNum != colNum) {
                if (updatedPrevText != data.getVal()) throw 'compareStoreAndDOM(): text value of unrelated cells should not be changed from textEvent';
            } else {
                if (updatedPrevText != prevText) throw 'compareStoreAndDOM(): prevText value of target cell should be recorded correctly in updatedPrevState ' + updatedPrevText + ' ' + prevText;
            }
        }
    }

    let entryKey = `\.row${rowNum}\.col${colNum}`;
    // check that currentState looks the way it is supposed to
    if (currentState.getGroupEntriesSize() != 0) throw 'compareStoreAndDOM(): unexpected groupEntry in currentState after event';
    if (currentState.getIndividualEntriesSize() > 1) throw 'compareStoreAndDOM(): individualEntries of currentState records more than one cell';
    let cellOfCurrentState = currentState.getIndividualEntry(entryKey);
    if (cellOfCurrentState == undefined) throw 'compareStoreAndDOM(): individualEntries of currentState is missing expected cell';

    if (cellOfCurrentState.getVal() != newText) throw 'compareStoreAndDOM(): val of current individualEntry does not match newText';
    // check styles
    if (cellOfCurrentState.getStyleMap().size != 0) throw 'compareStoreAndDOM(): unexpected styleEntry in current individualEntry';
}

export default textChangeTest;