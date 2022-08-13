import { store } from '../../../../store/store.js'
import { getInLine, nextTurn } from '../../../../tests/sequenceHelpers.js'

const DOWN = 'DOWN';
const UP = 'UP';

const CONTROL = 'Control';
const META = 'Meta';
const SHIFT = 'Shift';
const Z = 'z';
const Y = 'y';
const C = 'c';
const X = 'x';
const V = 'v';
const FLUFF = 'q';

const CTRL_DOWN = { id: CONTROL, status: DOWN };
const CTRL_UP = { id: CONTROL, status: UP };
const META_DOWN = { id: META, status: DOWN };
const META_UP = { id: META, status: UP };
const SHIFT_DOWN = { id: SHIFT, status: DOWN };
const SHIFT_UP = { id: SHIFT, status: UP };
const Z_DOWN = { id: Z, status: DOWN };
const Z_UP = { id: Z, status: UP };
const Y_DOWN = { id: Y, status: DOWN };
const Y_UP = { id: Y, status: UP };
const X_DOWN = { id: X, status: DOWN };
const X_UP = { id: X, status: UP };
const C_DOWN = { id: C, status: DOWN };
const C_UP = { id: C, status: UP };
const V_DOWN = { id: V, status: DOWN };
const V_UP = { id: V, status: UP };
const FLUFF_DOWN = { id: FLUFF, status: DOWN };
const FLUFF_UP = { id: FLUFF, status: UP };

const UNDO_DISPATCH = [CTRL_DOWN, Z_DOWN];
const UNDO_FINISH = [Z_UP, CTRL_UP];
const REDO_DISPATCH = [CTRL_DOWN, Y_DOWN];
const REDO_FINISH = [Y_UP, CTRL_UP];
const SIX_FINGERED_HAND = [CTRL_DOWN, SHIFT_DOWN, Z_DOWN, X_DOWN, C_DOWN, V_DOWN];
const SIX_FINGERED_HAND_FINISH = [CTRL_UP, SHIFT_UP, Z_UP, X_UP, C_UP, V_UP];
const FLUFF_FULL = [FLUFF_DOWN, FLUFF_UP];

const UNDO = 'Undo';
const REDO = 'Redo';
const NO_CHANGE = 'No Change'

const WAIT_IN_QUEUE = -1;
const ARRANGE_AND_ACTION = 0;
const ASSERT = 1;

function keyInputTest(turn) {
    console.log('\n--------KEY INPUT TEST-----------------------');
    getInLine(turn);

    let events = [UNDO_DISPATCH, UNDO_FINISH, UNDO_DISPATCH, UNDO_FINISH, REDO_DISPATCH, REDO_FINISH, REDO_DISPATCH, REDO_FINISH, REDO_DISPATCH, REDO_FINISH, FLUFF_FULL];

    if (validateSequence(events) == -1) return;

    let sheet = document.querySelector('#spreadsheet');
    let keyState = new Set();
    let predictedKeyOutcome = null;
    let predictedChange = null;
    let i = 0;
    let j = 0;
    let timer;
    let stage = WAIT_IN_QUEUE;
    let recordedTimeTravelCounter;
    let dawdleCount = 0;

    timer = setInterval(() => {
        try {
            let storeState = store.getState();
            let currentTimeTravelCounter = storeState.keyboardEvents.timeTravelCounter;
            let outcome = storeState.keyboardEvents.outcome;
            let key = events[i][j];
            switch (stage) {
                case WAIT_IN_QUEUE: if (dawdleCount++ > 5) stage = ARRANGE_AND_ACTION;
                case ARRANGE_AND_ACTION:
                    recordedTimeTravelCounter = currentTimeTravelCounter;
                    predictedKeyOutcome = updateKeyState(keyState, key);
                    if (predictedKeyOutcome != NO_CHANGE) {
                        predictedChange = capturePredictedChange(predictedKeyOutcome, timer);
                    } else predictedChange = NO_CHANGE;
                    sheet.dispatchEvent(new KeyboardEvent(key.status == DOWN ? 'keydown' : 'keyup', { key: key.id, bubbles: true }));
                    stage = ASSERT;
                    break;
                case ASSERT:
                    if (predictionMatchesActualEvent(predictedKeyOutcome, outcome, recordedTimeTravelCounter, currentTimeTravelCounter, key, i, j)) {
                        console.log('-------------- Event: ' + predictedKeyOutcome);
                        compareStoreAndDOM(predictedKeyOutcome, predictedChange);
                    }
                    let newIndices = getIndicesOfNextEvent(i, j, events, turn, timer);
                    if (newIndices != undefined) [i, j] = newIndices;
                    stage = ARRANGE_AND_ACTION;
                    break;
                default: break;
            }
        } catch (e) {
            console.log('Error: ' + e);
            clearInterval(timer);
        }
    }, 100);
}

// Check that no impossible events happen, like CTRL_UP w/o a corresponding prior CTRL_DOWN
// Also ensure the sequence is finished, that all 'DOWN' events are followed by corresponding 'UP' events
function validateSequence(events) {
    try {
        let seen = new Set();
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
            }
        }
        if (seen.size > 0) throw 'keyInputTest(): unfinished sequence (one or more DOWN events are missing concluding UP event)'
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

function predictionMatchesActualEvent(predictedKeyOutcome, currentKeyOutcome, previousTimeTravelCounter, currentTimeTravelCounter, key, i, j) {
    if (currentKeyOutcome != predictedKeyOutcome) throw 'Error: keyInputTest(): key event outcome does not match prediction:\nkey: ' + key.id + ' ' + key.status + ' i: ' + i + ' j: ' + j + '\nPredicted: ' + predictedKeyOutcome + '\nActual: ' + currentKeyOutcome;
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
                for (let i = 0; i < entries.length; ++i) {
                    if (entries[i].style.width != value + 'px') throw 'compareGroup() failed on width';
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
                    if (entries[i].querySelector('input').style.height != value + 'px') throw 'compareGroup() failed on inputHeight';
                    if (entries[i].querySelector('#cover').style.height != value + 'px') throw 'compareGroup() failed on coverHeight';
                }
            }
        }
    }
}

function getIndicesOfNextEvent(i, j, events, turn, timer) {
    if (j + 1 < events[i].length) return [i, ++j];
    else if (i + 1 < events.length) {
        return [++i, 0];
    } else {
        console.log('keyInputTest successful');
        nextTurn(turn);
        clearInterval(timer);
    }
}

export default keyInputTest;