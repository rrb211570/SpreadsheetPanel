import { getInLine, nextTurn } from '../../../../tests/sequenceHelpers.js'
import { getResizableColData, getResizableRowData } from './resizingHandler.js'
import { store } from './../../../../store/store.js'
import { logError, logSuccess } from '../../../../tests/helper.js';

function resizersTests(turn) {
    let axisCellsX = document.querySelectorAll('.AxisX');
    let axisCellsY = document.querySelectorAll('.AxisY');
    let resizeSelections = [[axisCellsX, -5], [axisCellsY, -1], [[axisCellsX[0]], 15], [axisCellsY, 12], [[axisCellsX[0]], 20], [[axisCellsY[0]], 12]]
    try {
        if (resizeSelections.length > 0) checkReactionOfResizing(1, resizeSelections[0], turn, true, resizeSelections.length);
        for (let i = 1; i < resizeSelections.length; ++i) checkReactionOfResizing(i + 1, resizeSelections[i], turn, false, resizeSelections.length);
    } catch (e) {
        console.log('resizingErr: checkReactionOfResizing param error: ' + e);
        logError(null, e);
    }
}

function checkHorizontalResizersInitialization() {
    try {
        let elems = document.querySelectorAll('.AxisX');
        let logMsg = '';
        elems.forEach((elem, idx) => {
            let resizer = elem.querySelector('.resizer-horizontal')
            if (resizer == null) {
                logMsg = logMsg + 'col' + (idx + 1) + ': horizontal resizer not found\n';
            } else if (22 != (parseInt(resizer.style.height, 10))) {
                logMsg = logMsg + 'col' + (idx + 1) + ': horizontal resizer does not match height of Y-axis cell \'' + resizer.style.height + '\' : should be \'22px\' \n';
            }
        })
        if (logMsg.length != 0) console.log(logMsg);
        else console.log('horizontalResizers appended correctly');
    } catch (error) {
        console.log('checkHorizontalResizersInitialization(): ' + error);
    }
}

function checkVerticalResizersInitialization() {
    try {
        let elems = document.querySelectorAll('.AxisY');
        let logMsg = '';
        elems.forEach((elem, idx) => {
            let resizer = elem.querySelector('.resizer-vertical')
            if (resizer == null) {
                logMsg = logMsg + 'row' + idx + ': vertical resizer not found\n';
            } else if (50 != (parseInt(resizer.style.width, 10))) {
                logMsg = logMsg + 'row' + idx + ': vertical resizer does not match width of X-axis cell \'' + resizer.style.width + '\' : should be \'50px\'\n';
            }
        })
        if (logMsg.length != 0) console.log(logMsg);
        else console.log('verticalResizers appended correctly');
    } catch (error) {
        console.log('checkVerticalResizersInitialization(): ' + error);
    }
}

function checkReactionOfResizing(testCaseIndex, resizeDetails, turn, isFirstCall, totalTestCases) {
    let timer;
    let [axisCells, deltaIncrement] = resizeDetails;
    try {
        let axisClass = getAxisClass(axisCells);
        let resizer;
        let delta = 0;
        let index = -1;
        let myTurnNumber = getInLine(turn);
        let mouseState = -1;
        let dimensionsBeforeMove;
        let dimensionsAfterMove;
        let changeHistoryBeforeMove;
        let changeHistoryIndexBeforeMove;
        let changeHistoryAfterMove;
        let changeHistoryIndexAfterMove;
        timer = setInterval(() => {
            switch (mouseState) {
                case -1: // FIFO waiting queue
                    if (turn.current == myTurnNumber) {
                        if (isFirstCall) {
                            console.log('\n--------RESIZING TEST-----------------------');
                            checkHorizontalResizersInitialization();
                            checkVerticalResizersInitialization();
                        }
                        mouseState = 0;
                    }
                    break;
                case 0:
                    if (++index < axisCells.length) {
                        resizer = getResizer(axisCells[index], axisClass)
                        mouseState++;
                    } else {
                        console.log('resizing affects store and DOM correctly');
                        if (testCaseIndex == totalTestCases) logSuccess('resizingTest()', totalTestCases);
                        nextTurn(turn); // increment turn.current
                        clearInterval(timer);
                    }
                    break;
                case 1:
                    resizer.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, clientX: 0 }));
                    try {
                        dimensionsBeforeMove = captureResizerData(axisClass, axisCells[index]);
                        let historyState = store.getState().history;
                        [changeHistoryBeforeMove, changeHistoryIndexBeforeMove] = [historyState.changeHistory, historyState.changeHistoryIndex];
                    } catch (error) {
                        console.log('resizingErr: ' + error);
                        clearInterval(timer);
                    }
                    mouseState++;
                    break;
                case 2:
                case 3:
                case 4:
                    let params = { bubbles: true, cancelable: true };
                    params[axisClass == 'AxisX' ? 'clientX' : 'clientY'] = delta += deltaIncrement;
                    resizer.dispatchEvent(new MouseEvent('mousemove', params));
                    mouseState++;
                    break;
                case 5:
                    resizer.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true }));
                    try {
                        dimensionsAfterMove = captureResizerData(axisClass, axisCells[index]);
                        let historyState = store.getState().history;
                        [changeHistoryAfterMove, changeHistoryIndexAfterMove] = [historyState.changeHistory, historyState.changeHistoryIndex];
                        if (!expectedTableChanges(axisClass, dimensionsBeforeMove, dimensionsAfterMove, delta)) throw 'mousemove: resizer not affecting table correctly';
                        if (!expectedChangeHistoryChanges(axisClass, delta, changeHistoryBeforeMove, changeHistoryIndexBeforeMove, changeHistoryAfterMove, changeHistoryIndexAfterMove)) throw 'mousemove: resizer not affecting changeHistory properly';
                    } catch (error) {
                        console.log('resizingErr: ' + error);
                        clearInterval(timer);
                    }
                    delta = 0;
                    mouseState = 0;
                    break;
                default: break;
            }
        }, 5);
    } catch (e) {
        let errMsg = 'Err: checkReactionOfResizing(): { testCaseIndex: ' + testCaseIndex + ' } : ' + e;
        console.log(errMsg);
        logError(errMsg);
        clearInterval(timer);
    }
}

function getAxisClass(axisCells) {
    let arr = [];
    if (typeof axisCells !== typeof arr) throw 'getAxisClass(): axisCells is not an array';
    if (axisCells.length == 0) throw 'getAxisClass(): axisCells is empty';
    if (axisCells instanceof Element) throw 'getAxisClass(): axisCells should be an array of DOM elements'
    if (!(axisCells[0] instanceof Element)) throw 'getAxisClass(): axisCells should be an array of DOM elements';
    let axisName = [...axisCells[0].classList].filter(name => /^Axis.$/.test(name));
    if (axisName.length == 0) throw 'getAxisClass(): axisClass not found in axisCells[0]';
    if (axisName[0] != 'AxisX' && axisName[0] != 'AxisY') throw 'getAxisClass(): found axis class not equal to "AxisX" or "AxisY"'
    return axisName[0];
}

function getResizer(axisCell, axisClass) {
    if (!(axisCell instanceof Element)) throw 'getResizer(): axisCell should be a valid DOM element';
    let reg = new RegExp(axisClass);
    let possibleAxisClass = [...axisCell.classList].filter(name => reg.test(name));
    if (possibleAxisClass.length == 0) throw 'getResizer(): axisCell\'s axis class must match axis parameter';
    let resizer = axisCell.querySelector(axisClass == 'AxisX' ? '.resizer-horizontal' : '.resizer-vertical');
    if (!resizer instanceof Element) throw 'getResizer(): resizer not found in axisCell';
    return resizer;
}

function captureResizerData(axisClass, axisCell) {
    let tableDimensions = store.getState().tableDimensions;
    if (axisClass == 'AxisX') {
        let colNum = getResizerIndex(axisClass, axisCell);
        let cellWidth = parseInt(axisCell.style.width, 10);
        return getResizableColData(colNum, cellWidth, tableDimensions.width)
    } else {
        let rowNum = getResizerIndex(axisClass, axisCell);
        let cellHeight = parseInt(axisCell.style.height, 10);
        return getResizableRowData(rowNum, cellHeight, tableDimensions.height);
    }
}

function getResizerIndex(axisClass, axisCell) {
    if (axisClass == 'AxisX') return parseInt([...axisCell.classList].filter(name => /^col\d+$/.test(name))[0].slice(-1), 10);
    else return parseInt([...axisCell.classList].filter(name => /^row\d+$/.test(name))[0].slice(-1), 10);
}

// check that when delta is applied to all width/marginLeft values in dimensionsBeforeMove,
// that it is reflected in dimensionsAfterMove
function expectedTableChanges(axisClass, dimensionsBeforeMove, dimensionsAfterMove, delta) {
    try {
        if (axisClass == 'AxisX') {
            for (const [entryKey, data] of dimensionsBeforeMove.getIndividualEntries()) {
                if (!dimensionsAfterMove.hasIndividualEntry(entryKey)) throw entryKey + ' in dimensionsBeforeMove, but not found in dimensionsAfterMove';
                let dataAfter = dimensionsAfterMove.getIndividualEntry(entryKey);
                let beforeStyleMap = data.getStyleMap();
                let afterStyleMap = dataAfter.getStyleMap();
                if (beforeStyleMap.size != 1 || afterStyleMap.size != 1) throw entryKey + ' should not have multiple styleMap entries'
                if (entryKey == 'table') {
                    if (beforeStyleMap.get('width') == null || afterStyleMap.get('width') == null) throw entryKey + ' is missing property "width"';
                    if (beforeStyleMap.get('width') + delta != afterStyleMap.get('width')) throw entryKey + ' width not updated properly';
                } else if (!/.col\d+/.test(entryKey)) {
                    if (beforeStyleMap.get('width') == null || afterStyleMap.get('width') == null) throw entryKey + ' is missing property "width"';
                    if (beforeStyleMap.get('width') + delta != afterStyleMap.get('width')) throw entryKey + ' width not updated properly';
                    if (data.row != dataAfter.row) throw entryKey + ' row does not match';
                } else {
                    if (data.cellRow != dataAfter.cellRow) throw entryKey + ' row does not match';
                    if (data.cellCol != dataAfter.cellCol) throw entryKey + ' col does not match';
                    if (data.val != dataAfter.val) throw entryKey + ' val does not match';
                    if (beforeStyleMap.get('width') == null) {
                        if (beforeStyleMap.get('marginLeft') == null || afterStyleMap.get('marginLeft') == null) throw entryKey + ' is missing property "marginLeft"';
                        if (beforeStyleMap.get('marginLeft') + delta != afterStyleMap.get('marginLeft')) throw entryKey + ' marginLeft not updated properly';
                    } else {
                        if (afterStyleMap.get('width') == null) throw entryKey + ' is missing property "width"';
                        if (beforeStyleMap.get('width') + delta != afterStyleMap.get('width')) throw entryKey + ' width not updated properly';
                    }
                }
            }
        } else {
            for (const [entryKey, data] of dimensionsBeforeMove.getIndividualEntries()) {
                if (!dimensionsAfterMove.hasIndividualEntry(entryKey)) throw entryKey + ' in dimensionsBeforeMove, but not found in dimensionsAfterMove';
                let dataAfter = dimensionsAfterMove.getIndividualEntry(entryKey);
                let beforeStyleMap = data.getStyleMap();
                let afterStyleMap = dataAfter.getStyleMap();
                if (beforeStyleMap.size != 1 || afterStyleMap.size != 1) throw entryKey + ' should not have multiple styleMap entries'
                if (beforeStyleMap.get('height') == null || afterStyleMap.get('height') == null) throw entryKey + ' is missing property "height"';
                if (beforeStyleMap.get('height') + delta != afterStyleMap.get('height')) throw entryKey + ' height not updated properly';
                if (!/.col\d+/.test(entryKey)) {
                    if (data.row != dataAfter.row) throw entryKey + ' row does not match';
                } else {
                    if (data.cellRow != dataAfter.cellRow) throw entryKey + ' row does not match';
                    if (data.cellCol != dataAfter.cellCol) throw entryKey + ' col does not match';
                    if (data.val != dataAfter.val) throw entryKey + ' val does not match';
                }
            }
        }
        return true;
    } catch (error) {
        throw 'expectedTableChanges(): ' + error;
    }
}

function expectedChangeHistoryChanges(axisClass, delta, changeHistoryBeforeMove, changeHistoryIndexBeforeMove, changeHistoryAfterMove, changeHistoryIndexAfterMove) {
    try {
        if (changeHistoryIndexBeforeMove != changeHistoryIndexAfterMove - 1) throw 'changeHistoryIndex not updated properly';
        // preservation
        for (const [entryKey, value] of changeHistoryBeforeMove[changeHistoryIndexBeforeMove].getIndividualEntries()) {
            if (!changeHistoryAfterMove[changeHistoryIndexBeforeMove].hasIndividualEntry(entryKey)) throw 'entry not preserved';
            let valueAfterMove = changeHistoryAfterMove[changeHistoryIndexBeforeMove].getIndividualEntry(entryKey);
            if (value.getStyleMap().size != valueAfterMove.getStyleMap().size) throw "valueAfterMove does not preserve  styleMap pairs of value";
            let valueAfterMoveStyleMap = valueAfterMove.getStyleMap();
            for (const [property, val] of value.getStyleMap().entries()) {
                if (valueAfterMoveStyleMap.get(property) !== val) throw 'valueAfterMove does not preserve styleMap pairs of value';
            }
            if (!/.col\d+/.test(entryKey) && entryKey !== 'table' && value.getRow() != valueAfterMove.getRow()) throw 'valueAfterMove does not preserve row of value';
            else if (/.col\d+/.test(entryKey) && (value.getCellRow() != valueAfterMove.getCellRow()
                || value.getCellCol() != valueAfterMove.getCellCol()
                || value.getVal() != valueAfterMove.getVal())) throw 'valueAfterMove does not preserve cellRow/cellCol/val of value';
        }
        // check resizing is reflected in changeHistoryAfterMove
        for (const [entryKey, valueAfterMove] of changeHistoryAfterMove[changeHistoryIndexAfterMove].getIndividualEntries()) {
            if (valueAfterMove.getStyleMap().size != 1) throw 'unnecessary stylePair in valueAfterMove';
            if (axisClass == 'AxisX') {
                if (valueAfterMove.getStyleMap().has('width')) {
                    let w = valueAfterMove.getStyleMap().get('width');
                    if (isNaN(parseInt(w, 10)) || parseInt(w, 10) !== w) throw 'horizontal resizing not updating stylePair w/ numerical value';
                    let valueBeforeMove = changeHistoryAfterMove[changeHistoryIndexBeforeMove].getIndividualEntry(entryKey);
                    if (valueBeforeMove.getStyleMap().get('width') != w - delta) throw 'width not adjusted by delta in changeHistory';
                } else if (valueAfterMove.getStyleMap().has('marginLeft')) {
                    let ml = valueAfterMove.getStyleMap().get('marginLeft');
                    if (isNaN(parseInt(ml, 10)) || parseInt(ml, 10) !== ml) throw 'horizontal resizing not updating stylePair w/ numerical value';
                    let valueBeforeMove = changeHistoryAfterMove[changeHistoryIndexBeforeMove].getIndividualEntry(entryKey);
                    if (valueBeforeMove.getStyleMap().get('marginLeft') != ml - delta) throw 'ml not adjusted by delta in changeHistory';
                } else throw 'horizontal resizing has stylePair property different from height/marginLeft';
            } else if (axisClass = 'AxisY') {
                if (valueAfterMove.getStyleMap().has('height')) {
                    let h = valueAfterMove.getStyleMap().get('height');
                    if (isNaN(parseInt(h, 10)) || parseInt(h, 10) !== h) throw 'vertical resizing not updating stylePair w/ numerical value';
                    let valueBeforeMove = changeHistoryAfterMove[changeHistoryIndexBeforeMove].getIndividualEntry(entryKey);
                    if (valueBeforeMove.getStyleMap().get('height') != h - delta) throw 'height not adjusted by delta in changeHistory';
                } else throw 'vertical resizing has stylePair property different from height';
            }
        }
        return true;
    } catch (error) {
        throw 'expectedChangeHistoryChanges(): ' + error;
    }
}

export { resizersTests, checkReactionOfResizing };