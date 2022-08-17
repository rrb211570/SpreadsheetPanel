import { getInLine, nextTurn } from '../../../../../tests/sequenceHelpers.js'
import { store } from './../../../../../store/store.js'

const WAIT_IN_QUEUE = -1;
const ARRANGE_AND_ACTION = 0;
const ASSERT = 1;

const ARRANGE_AND_ACTION_SINGLE_CLICK = 0;
const ASSERT_SINGLE_CLICK = 1;
const ACTION_DOUBLE_CLICK = 2;
const ASSERT_DOUBLE_CLICK = 3;

function selectionTest(turn) {
    try {
        checkReactionOfSelection(4, 5, turn, true);
        checkReactionOfSelection(1, 1, turn);
        checkReactionOfSelection(3, 7, turn);
        checkReactionOfSelection(8, 2, turn);
        checkReactionOfSelection(2, 4, turn);
    } catch (e) {
        console.log('Error: ' + e);
    }
}

function checkReactionOfSelection(rowNum, colNum, turn, isFirstCall) {
    let cell = document.querySelector(`.row${rowNum}.col${colNum} .selectionLayer`);
    let myTurnNumber = getInLine(turn);
    let stage = WAIT_IN_QUEUE;
    let prevSelectionEntries;
    let expectedSelectionEntries;
    let timer = setInterval(() => {
        try {
            switch (stage) {
                case WAIT_IN_QUEUE:
                    if (turn.current == myTurnNumber) {
                        if (isFirstCall) console.log('\n--------SELECTION TEST--------------------');
                        stage = ARRANGE_AND_ACTION;
                    }
                    break;
                case ARRANGE_AND_ACTION:
                    // arrange
                    prevSelectionEntries = store.getState().selection.entries;
                    expectedSelectionEntries = new Set([`${rowNum},${colNum}`])

                    // action
                    cell.focus();
                    cell.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, clientX: 0 }));

                    stage = ASSERT;
                    break;
                case ASSERT:
                    compareStoreAndDOM(prevSelectionEntries, expectedSelectionEntries);
                    console.log('selection affects store and DOM correctly');
                    nextTurn(turn);
                    clearInterval(timer);
                    break;
            }
        } catch (e) {
            console.log('checkReactionOfSelection(): ' + e);
            clearInterval(timer);
        }
    }, 200);
}

function checkReactionOfDoubleClickSelection(rowNum, colNum, turn, isFirstCall) {
    let cell = document.querySelector(`.row${rowNum}.col${colNum} .selectionLayer`);
    let myTurnNumber = getInLine(turn);
    let stage = WAIT_IN_QUEUE;
    let prevSelectionEntries;
    let expectedSelectionEntries;
    let timer = setInterval(() => {
        try {
            switch (stage) {
                case WAIT_IN_QUEUE:
                    if (turn.current == myTurnNumber) {
                        if (isFirstCall) console.log('\n--------SELECTION TEST (DOUBLE CLICK)--------------------');
                        stage = ARRANGE_AND_ACTION_SINGLE_CLICK;
                    }
                    break;
                case ARRANGE_AND_ACTION_SINGLE_CLICK:
                    // arrange
                    prevSelectionEntries = store.getState().selection.entries;
                    expectedSelectionEntries = new Set([`${rowNum},${colNum}`])

                    // action
                    cell.focus();
                    cell.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, clientX: 0 }));
                    stage = ASSERT_SINGLE_CLICK;
                    break;
                case ASSERT_SINGLE_CLICK:
                    compareStoreAndDOM(prevSelectionEntries, expectedSelectionEntries);
                    console.log('selection (single click) affects store and DOM correctly');
                    break;
                case ACTION_DOUBLE_CLICK:
                    cell.dispatchEvent(new MouseEvent('dblclick', { bubbles: true, cancelable: true, clientX: 0 }));
                    break;
                case ASSERT_DOUBLE_CLICK:
                    compareStoreAndDOM(prevSelectionEntries, expectedSelectionEntries);
                    console.log('selection (double click) affects store and DOM correctly');
                    nextTurn(turn);
                    clearInterval(timer);
                    break;
                default: break;
            }
        } catch (e) {
            console.log('checkReactionOfDoubleClickSelection(): ' + e);
            clearInterval(timer);
        }
    }, 200);
}

function compareStoreAndDOM(prevSelectionEntries, expectedSelectionEntries) {
    let currentSelectionEntries = store.getState().selection.entries;
    let setDifference = new Set();
    for (const entry of currentSelectionEntries.values()) {
        if (!expectedSelectionEntries.has(entry)) throw 'compareStoreAndDOM(): currentSelectionEntries has entry that expectedSelectionEntries does not have';
    }
    for (const entry of expectedSelectionEntries.values()) {
        if (!currentSelectionEntries.has(entry)) throw 'compareStoreAndDOM(): expectedSelectionEntries has entry that currentSelectionEntries does not have';
    }
    for (const entry of prevSelectionEntries.values()) {
        if (!currentSelectionEntries.has(entry)) setDifference.add(entry);
    }

    // check that deselected entries of prevSelection are cleared of highlights
    for (const entry of setDifference.values()) {
        let rowNum = parseInt(entry.split(',')[0], 10);
        let colNum = parseInt(entry.split(',')[1], 10);
        let highlightLayer = document.querySelector(`.row${rowNum}.col${colNum} .highlightLayer`);
        if (highlightLayer.style.border != 'medium none') throw 'compareStoreAndDOM(): prevSelectedCell not cleared of highlight: ' + rowNum + ' ' + colNum;
    }

    // check that currentSelection is highlighted properly
    for (const entry of currentSelectionEntries.values()) {
        let rowNum = parseInt(entry.split(',')[0], 10);
        let colNum = parseInt(entry.split(',')[1], 10);
        let highlightLayer = document.querySelector(`.row${rowNum}.col${colNum} .highlightLayer`);
        if (highlightLayer.style.border != '2px solid blue') throw 'compareStoreAndDOM(): currentSelectionEntry not highlighted properly ' + rowNum + ' ' + colNum;
    }
}

export { selectionTest, checkReactionOfSelection };