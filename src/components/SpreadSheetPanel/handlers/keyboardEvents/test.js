import { store } from '../../../../store/store.js'
import { getInLine, nextTurn } from '../../../../tests/sequenceHelpers.js'
import { DOWN, CONTROL, META, SHIFT, Z, Y, UNDO_DISPATCH, UNDO_FINISH, REDO_DISPATCH, REDO_FINISH, FLUFF_FULL } from './keyMacros.js'
const UNDO = 'Undo';
const REDO = 'Redo';
const NO_CHANGE = 'No Change'

const WAIT_IN_QUEUE = -1;
const ARRANGE_AND_ACTION = 0;
const ASSERT = 1;

function keyInputTest(atomicTurn) {
    let events = [UNDO_DISPATCH, UNDO_FINISH, UNDO_DISPATCH, UNDO_FINISH, REDO_DISPATCH, REDO_FINISH, REDO_DISPATCH, REDO_FINISH, REDO_DISPATCH, REDO_FINISH, FLUFF_FULL];
    let totalTestCases = validateSequence(events);
    if (totalTestCases == -1) return;
    let testCaseIndex = 1;

    try {
        let keyState = new Set();
        for (let i = 0; i < events.length; ++i) {
            for (let j = 0; j < events[i].length; ++j) {
                if (i == 0 && j == 0) checkReactionOfKeyInput(testCaseIndex, events[i][j], keyState, atomicTurn, true, totalTestCases);
                else checkReactionOfKeyInput(++testCaseIndex, events[i][j], keyState, atomicTurn, false, totalTestCases);
            }
        }
    } catch (e) {
        console.log('Error: checkReactionOfKeyInput param error: ' + e);
        logError(null, e);
    }
}

function checkReactionOfKeyInput(testCaseIndex, keyEvent, keyState, atomicTurn, isFirstCall, totalTestCases) {
    let sheet = document.querySelector('#spreadsheet');
    let predictedKeyOutcome = null;
    let predictedChange = null;
    let recordedTimeTravelCounter;
    let myTurnNumber = getInLine(atomicTurn);
    let stage = WAIT_IN_QUEUE;

    let timer = setInterval(() => {
        try {
            let storeState = store.getState();
            let currentTimeTravelCounter = storeState.keyboardEvents.timeTravelCounter;
            let outcome = storeState.keyboardEvents.outcome;
            switch (stage) {
                case WAIT_IN_QUEUE:
                    if (atomicTurn.current == myTurnNumber) {
                        if (isFirstCall) console.log('\n--------KEY INPUT TEST--------------------');
                        stage = ARRANGE_AND_ACTION;
                    }
                    break;
                case ARRANGE_AND_ACTION:
                    recordedTimeTravelCounter = currentTimeTravelCounter;
                    predictedKeyOutcome = updateKeyState(keyState, keyEvent);
                    if (predictedKeyOutcome != NO_CHANGE) {
                        predictedChange = capturePredictedChange(predictedKeyOutcome, timer);
                    } else predictedChange = NO_CHANGE;
                    sheet.dispatchEvent(new KeyboardEvent(keyEvent.status == DOWN ? 'keydown' : 'keyup', { key: keyEvent.id, bubbles: true }));
                    stage = ASSERT;
                    break;
                case ASSERT:
                    if (predictionMatchesActualEvent(predictedKeyOutcome, outcome, recordedTimeTravelCounter, currentTimeTravelCounter, keyEvent)) {
                        console.log('-------------- Event: ' + predictedKeyOutcome);
                        compareStoreAndDOM(predictedKeyOutcome, predictedChange);
                    }
                    if (testCaseIndex == totalTestCases) logSuccess(totalTestCases);
                    nextTurn(atomicTurn);
                    clearInterval(timer);
                    break;
                default: break;
            }
        } catch (e) {
            console.log('Error: ' + e);
            logError(testCaseIndex, e);
            nextTurn(atomicTurn);
            clearInterval(timer);
        }
    }, 100);
}

// Check that no impossible events happen, like CTRL_UP w/o a corresponding prior CTRL_DOWN
// Also ensure the sequence is finished, that all 'DOWN' events are followed by corresponding 'UP' events
function validateSequence(events) {
    try {
        let seen = new Set();
        let totalEvents = 0;
        for (let i = 0; i < events.length; ++i) {
            for (let j = 0; j < events[i].length; ++j) {
                let key = events[i][j];
                if (key.status == DOWN) {
                    if (seen.has(key.id)) {
                        throw 'keyInputTest(): encountered duplicate DOWN event w/o necessary UP event in-between\nkey: ' + key.id + ' ' + key.status + ' i: ' + i + ' j: ' + j;
                    } else seen.add(key.id);
                } else if (seen.has(key.id)) {
                    seen.delete(key.id);
                } else throw 'keyInputTest(): UP event encountered without prior corresponding DOWN event\nkey: ' + key.id + ' ' + key.status + ' i: ' + i + ' j: ' + j;
                totalEvents++;
            }
        }
        if (seen.size > 0) throw 'keyInputTest(): unfinished sequence (one or more DOWN events are missing concluding UP event)'
        return totalEvents;
    } catch (e) {
        console.log('Error: ' + e);
        return -1;
    }
}

function updateKeyState(keyState, key) {
    if (key.status == DOWN) {
        keyState.add(key.id);
        if (key.id == Z && (keyState.has(CONTROL) || keyState.has(META)) && !keyState.has(SHIFT)) return UNDO;
        else if (key.id == Y && (keyState.has(CONTROL) || keyState.has(META)) && !keyState.has(SHIFT)) return REDO;
    } else keyState.delete(key.id);
    return NO_CHANGE;
}

function capturePredictedChange(predictedKeyOutcome) {
    let storeState = store.getState();
    let changeHistoryIndex = storeState.history.changeHistoryIndex;
    let changeHistory = storeState.history.changeHistory;
    let delta;
    if (predictedKeyOutcome == UNDO) {
        delta = -1;
    } else if (predictedKeyOutcome == REDO) {
        delta = 1;
    } else throw 'capturePredictedChange(): currently unsupported outcome: ' + predictedKeyOutcome;
    let newIndex = changeHistoryIndex + delta;
    if (newIndex < 0 || newIndex >= changeHistory.length) return NO_CHANGE;
    else return { predictedIndex: changeHistoryIndex + delta, predictedHistoryState: changeHistory[changeHistoryIndex + delta] };
}

function predictionMatchesActualEvent(predictedKeyOutcome, currentKeyOutcome, previousTimeTravelCounter, currentTimeTravelCounter, key) {
    if (currentKeyOutcome != predictedKeyOutcome) throw 'Error: keyInputTest(): key event outcome does not match prediction:\nkey: ' + key.id + ' ' + key.status + '\nPredicted: ' + predictedKeyOutcome + '\nActual: ' + currentKeyOutcome;
    if (predictedKeyOutcome != null && previousTimeTravelCounter + 1 == currentTimeTravelCounter) return true;
    else return false;
}

function compareStoreAndDOM(predictedKeyOutcome, predictedChange) {
    if (predictedChange == NO_CHANGE) {
        console.log('NO CHANGE');
        return;
    }
    let changeHistoryIndex = store.getState().history.changeHistoryIndex;
    if (changeHistoryIndex != predictedChange.predictedIndex) throw ('changeHistoryIndex not updated correctly');

    if (predictedKeyOutcome == UNDO) {
        compareWithDOM(predictedChange.predictedHistoryState);
    } else if (predictedKeyOutcome == REDO) {
        compareWithDOM(predictedChange.predictedHistoryState);
    } else console.log('compareStoreAndDOM(): unrecognized predictedKeyOutcome: ' + predictedKeyOutcome);
}

function compareWithDOM(predictedHistoryState) {
    for (const [entryKey, data] of predictedHistoryState.getIndividualEntries()) {
        if (entryKey == 'spreadsheet') compareSheet(data.getStyleMap());
        else if (!/\.col\d+/.test(entryKey)) {
            let entry = document.getElementById(entryKey.match(/\.row\d+/));
            compareEntry(entry, data.getStyleMap());
        } else {
            let entry = document.querySelector(entryKey.match(/\.row\d+\.col\d+$/));
            compareEntry(entry, data.getStyleMap(), data.getVal());
        }
    }
    for (const [group, styleMap] of predictedHistoryState.getGroupEntries()) {
        compareGroup(group, styleMap);
    }
}

function compareSheet(styleMap) {
    let h = null;
    let w = null;
    for (const [property, value] of styleMap.entries()) {
        if (property == 'height') h = value;
        else if (property == 'width') w = value;
    }
    document.getElementById('spreadsheet').querySelectorAll('.resizer-horizontal').forEach(resizer => {
        if (h != null && resizer.style.height != h + 'px') throw 'compareSheet() failed on resizer height';
    });
    document.getElementById('spreadsheet').querySelectorAll('.resizer-vertical').forEach(resizer => {
        if (w != null && resizer.style.width != w + 'px') throw 'compareSheet() failed on resizer width';
    });
    let dimensions = store.getState().sheetDimensions;
    if ((h != null && dimensions.tableHeight != h) || (w != null && dimensions.tableWidth != w)) throw 'compareSheet() failed on sheet dimensions';
}

function compareEntry(entry, styleMap, val) {
    if (val != null && entry.querySelector('input').value != val) throw 'compareEntry() failed on value';
    for (const [property, value] of styleMap.entries()) {
        switch (property) {
            case 'height':
                if (entry.style.height = !value + 'px') throw 'compareEntry() failed on height';
                if ([...entry.classList].filter(name => /^col0$/.test(name)).length != 0 && entry.style.lineHeight != value + 'px') {
                    throw 'compareEntry() failed on lineHeight of a specific Y axis cell';
                }
                if ([...entry.classList].filter(name => /^row0$/.test(name)).length == 0 &&
                    [...entry.classList].filter(name => /^col0$/.test(name)).length == 0 &&
                    [...entry.classList].filter(name => /^col\d+$/.test(name)).length != 0 &&
                    entry.querySelector('input').style.height != value - 4 + 'px' &&
                    entry.querySelector('#cover').style.height != value + 'px') {
                    throw 'compareEntry() failed on input and cover heights';
                }
                break;
            case 'width':
                entry.style.width = value + 'px';
                if ([...entry.classList].filter(name => /^row0$/.test(name)).length == 0 &&
                    [...entry.classList].filter(name => /^col0$/.test(name)).length == 0 &&
                    [...entry.classList].filter(name => /^col\d+$/.test(name)).length != 0 &&
                    entry.querySelector('input').style.width != value - 4 + 'px' &&
                    entry.querySelector('#cover').style.width != value + 'px') {
                    throw 'compareEntry() failed on input and cover widths';
                }
                break;
            case 'marginLeft':
                if (entry.style.marginLeft != value + 'px') throw 'compareEntry() failed on marginLeft';
                break;
        }
    }
}

function compareGroup(group, styleMap) {
    if (/^\.col\d+$/.test(group)) {
        for (const [property, value] of styleMap) {
            if (property == 'width') {
                let entries = document.querySelectorAll(group);
                let dx = value - parseInt(entries[0].style.width, 10);
                if (entries[0].style.width != value + 'px') throw 'compareGroup() failed on width';
                for (let i = 1; i < entries.length; ++i) {
                    if (entries[i].style.width != value + 'px') throw 'compareGroup() failed on width';
                    if (entries[i].querySelector('input').style.width != value - 8 + 'px') throw 'compareGroup() failed on inputWidth';
                    if (entries[i].querySelector('.selectionLayer').style.width != value + 'px') throw 'compareGroup() failed on selectionWidth';
                    if (entries[i].querySelector('.highlightLayer').style.width != value - 4 + 'px') throw 'compareGroup() failed on highlightWidth';
                }
                let colNum = parseInt(group.match(/(\d+)/)[0], 10); // check that cells do not overlap
                let elem = null;
                let prevMarginLeft = document.querySelector(`.col${colNum}`).style.marginLeft;
                let prevWidth = document.querySelector(`.col${colNum}`).style.width;
                while ((elem = document.querySelector(`.col${++colNum}`)) != null) {
                    let expectedMarginLeft = parseInt(prevMarginLeft, 10) + parseInt(prevWidth, 10) + 'px';
                    let entries = document.querySelectorAll(`.col${colNum}`);
                    for (let i = 0; i < entries.length; ++i) {
                        if (entries[i].style.marginLeft != expectedMarginLeft) throw 'compareGroup() failed on marginLeft';
                    }
                    prevMarginLeft = entries[0].style.marginLeft;
                    prevWidth = entries[0].style.width;
                }
            }
        }
    } else if (/^\.row\d+$/.test(group)) {
        for (const [property, value] of styleMap) {
            if (property == 'height') {
                let entries = document.querySelectorAll(group);
                entries[0].style.height = value + 'px';
                entries[1].style.height = value + 'px';
                entries[1].style.lineHeight = value + 'px';
                for (let i = 2; i < entries.length; ++i) {
                    if (entries[i].style.height != value + 'px') throw 'compareGroup() failed on height';
                    if (entries[i].querySelector('input').style.height != value - 6 + 'px') throw 'compareGroup() failed on inputHeight';
                    if (entries[i].querySelector('.selectionLayer').style.height != value + 'px') throw 'compareGroup() failed on selectionHeight';
                    if (entries[i].querySelector('.highlightLayer').style.height != value - 4 + 'px') throw 'compareGroup() failed on highlightHeight';
                }
            }
        }
    }
}

function logSuccess(totalTestCases) {
    document.querySelector('#testConsoleLog').innerHTML = document.querySelector('#testConsoleLog').innerHTML + `,keyInputTest(): ${totalTestCases}/${totalTestCases} PASS`;
    let testNum = document.querySelector('#testConsoleStatus').innerHTML.match(/(\d+)/)[0];
    document.querySelector('#testConsoleStatus').innerHTML = parseInt(testNum, 10) + 1 + ' NEXT';
}

function logError(testCaseIndex, e) {
    document.querySelector('#testConsoleError').innerHTML = 'Err: keyInputTest(): { testCaseIndex: ' + testCaseIndex + ' } : ' + e;
    let testNum = document.querySelector('#testConsoleStatus').innerHTML.match(/(\d+)/)[0];
    document.querySelector('#testConsoleStatus').innerHTML = parseInt(testNum, 10) + 1 + ' FAIL';
}

export { keyInputTest, checkReactionOfKeyInput, validateSequence };