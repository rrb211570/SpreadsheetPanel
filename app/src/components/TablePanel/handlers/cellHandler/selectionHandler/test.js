import { getInLine, nextTurn } from '../../../../../tests/sequenceHelpers.js'
import { store } from './../../../../../store/store.js'

const WAIT_IN_QUEUE = -1;
const ARRANGE_AND_ACTION = 0;
const ASSERT = 1;

const ARRANGE_AND_ACTION_SINGLE_CLICK = 0;
const ASSERT_SINGLE_CLICK = 1;
const ACTION_DOUBLE_CLICK = 2;
const ASSERT_DOUBLE_CLICK = 3;

function selectionTest(atomicTurn) {
    try {
        checkReactionOfDoubleClickSelection(4, 5, atomicTurn, true);
        checkReactionOfDoubleClickSelection(1, 1, atomicTurn);
        checkReactionOfDoubleClickSelection(3, 7, atomicTurn);
        checkReactionOfDoubleClickSelection(8, 2, atomicTurn);
        checkReactionOfDoubleClickSelection(2, 4, atomicTurn);
    } catch (e) {
        console.log('Error: ' + e);
    }
}

function checkReactionOfSingleClickSelection(rowNum, colNum, atomicTurn, isFirstCall) {
    let cell = document.querySelector(`.row${rowNum}.col${colNum} .selectionLayer`);
    let myTurnNumber = getInLine(atomicTurn);
    let stage = WAIT_IN_QUEUE;
    let prevSelectionEntries;
    let expectedSelectionEntries;
    let timer = setInterval(() => {
        try {
            switch (stage) {
                case WAIT_IN_QUEUE:
                    if (atomicTurn.current == myTurnNumber) {
                        if (isFirstCall) console.log('\n--------SELECTION TEST (single click)--------------------');
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
                    compareStoreAndDOM_singleClick(prevSelectionEntries, expectedSelectionEntries);
                    console.log('selection (single click) affects store and DOM correctly');
                    nextTurn(atomicTurn);
                    clearInterval(timer);
                    break;
            }
        } catch (e) {
            console.log('checkReactionOfSelection(): ' + e);
            clearInterval(timer);
        }
    }, 200);
}

function checkReactionOfDoubleClickSelection(rowNum, colNum, atomicTurn, isFirstCall) {
    let cell = document.querySelector(`.row${rowNum}.col${colNum} .selectionLayer`);
    let myTurnNumber = getInLine(atomicTurn);
    let stage = WAIT_IN_QUEUE;
    let prevSelectionEntries;
    let expectedSelectionEntries;
    let timer = setInterval(() => {
        try {
            switch (stage) {
                case WAIT_IN_QUEUE:
                    if (atomicTurn.current == myTurnNumber) {
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
                    compareStoreAndDOM_singleClick(prevSelectionEntries, expectedSelectionEntries);
                    console.log('selection (single click) affects store and DOM correctly');
                    stage = ACTION_DOUBLE_CLICK;
                    break;
                case ACTION_DOUBLE_CLICK:
                    cell.dispatchEvent(new MouseEvent('dblclick', { bubbles: true, cancelable: true, clientX: 0 }));
                    stage = ASSERT_DOUBLE_CLICK;
                    break;
                case ASSERT_DOUBLE_CLICK:
                    compareStoreAndDOM_doubleClick(prevSelectionEntries, expectedSelectionEntries);
                    console.log('selection (double click) affects store and DOM correctly');
                    nextTurn(atomicTurn);
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

function compareStoreAndDOM_singleClick(prevSelectionEntries, expectedSelectionEntries) {
    let currentSelectionEntries = store.getState().selection.entries;
    assertCurrentSelectionEqualsExpectedSelection(currentSelectionEntries, expectedSelectionEntries);
    let setDifference = getSetDifference(prevSelectionEntries, currentSelectionEntries);
    assertSetDifferenceClearedOfHighlights(setDifference);
    assertCurrentSelectionHighlighted(currentSelectionEntries); // different here
}

function compareStoreAndDOM_doubleClick(prevSelectionEntries, expectedSelectionEntries) {
    let currentSelectionEntries = store.getState().selection.entries;
    assertCurrentSelectionEqualsExpectedSelection(currentSelectionEntries, expectedSelectionEntries);
    let setDifference = getSetDifference(prevSelectionEntries, currentSelectionEntries);
    assertSetDifferenceClearedOfHighlights(setDifference);
    assertCurrentSelectionClearedOfHighlights(currentSelectionEntries); // different here
}

function assertCurrentSelectionEqualsExpectedSelection(currentSelectionEntries, expectedSelectionEntries){
    for (const entry of currentSelectionEntries.values()) {
        if (!expectedSelectionEntries.has(entry)) throw 'compareStoreAndDOM(): currentSelectionEntries has entry that expectedSelectionEntries does not have';
    }
    for (const entry of expectedSelectionEntries.values()) {
        if (!currentSelectionEntries.has(entry)) throw 'compareStoreAndDOM(): expectedSelectionEntries has entry that currentSelectionEntries does not have';
    }
}

function getSetDifference(prevSelectionEntries, currentSelectionEntries){
    let setDifference = new Set();
    for (const entry of prevSelectionEntries.values()) {
        if (!currentSelectionEntries.has(entry)) setDifference.add(entry);
    }
    return setDifference;
}

function assertSetDifferenceClearedOfHighlights(setDifference){
    for (const entry of setDifference.values()) {
        let rowNum = parseInt(entry.split(',')[0], 10);
        let colNum = parseInt(entry.split(',')[1], 10);
        let highlightLayer = document.querySelector(`.row${rowNum}.col${colNum} .highlightLayer`);
        if (highlightLayer.style.border != 'medium none') throw 'compareStoreAndDOM(): prevSelectedCell not cleared of highlight: ' + rowNum + ' ' + colNum;
    }
}

function assertCurrentSelectionHighlighted(currentSelectionEntries){
    for (const entry of currentSelectionEntries.values()) {
        let rowNum = parseInt(entry.split(',')[0], 10);
        let colNum = parseInt(entry.split(',')[1], 10);
        let highlightLayer = document.querySelector(`.row${rowNum}.col${colNum} .highlightLayer`);
        if (highlightLayer.style.border != '2px solid blue') throw 'compareStoreAndDOM(): currentSelectionEntry not highlighted properly ' + rowNum + ' ' + colNum;
    }
}

function assertCurrentSelectionClearedOfHighlights(currentSelectionEntries){
    for (const entry of currentSelectionEntries.values()) {
        let rowNum = parseInt(entry.split(',')[0], 10);
        let colNum = parseInt(entry.split(',')[1], 10);
        let highlightLayer = document.querySelector(`.row${rowNum}.col${colNum} .highlightLayer`);
        if (highlightLayer.style.border != 'medium none') throw 'compareStoreAndDOM(): currentSelectedCell not cleared of highlight: ' + rowNum + ' ' + colNum;
    }
}

export { selectionTest, checkReactionOfSingleClickSelection, checkReactionOfDoubleClickSelection };