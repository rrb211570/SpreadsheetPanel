import { store } from "../store/store.js";

function compareDOM(selectedRowNum, selectedColNum, propertyObj) {
    let cellValueDiv = document.querySelector(`.row${selectedRowNum}.col${selectedColNum}>.cellValueDiv`);
    let cellValue = cellValueDiv.querySelector('.cellValue');
    let [alteredProperty, alteredValue] = Object.entries(propertyObj)[0];

    if (alteredProperty == 'textValue') {
        if (cellValue.innerText != alteredValue) throw 'compareDOM(): cellValue[' + selectedRowNum + ',' + selectedColNum + '] not reflecting new ' + alteredProperty;
    } else if (alteredProperty == 'fontSize') {
        if (cellValue.style[alteredProperty] != alteredValue + 'px') throw 'compareDOM(): cellValue[' + selectedRowNum + ',' + selectedColNum + '] not reflecting new ' + alteredProperty;
    } else if (alteredProperty == 'fontColor') {
        if (cellValue.style.color != alteredValue) throw 'compareDOM(): cellValue[' + selectedRowNum + ',' + selectedColNum + '] not reflecting new ' + alteredProperty;
    } else if (alteredProperty == 'cellColor') {
        if (cellValueDiv.style.backgroundColor != alteredValue) throw 'compareDOM(): cellValueDiv[' + selectedRowNum + ',' + selectedColNum + '] not reflecting new ' + alteredProperty;
    } else if (alteredProperty == 'borders') {
        if (!cellValueDiv.style.boxShadow.includes(alteredValue)) throw 'compareDOM(): cellValueDiv[' + selectedRowNum + ',' + selectedColNum + '] not reflecting new ' + alteredProperty;
    } else if (alteredProperty == 'horizontalAlignment') {
        if (cellValue.style.textAlign != alteredValue) throw 'compareDOM(): cellValueDiv[' + selectedRowNum + ',' + selectedColNum + '] not reflecting new ' + alteredProperty;
    } else if (alteredProperty == 'verticalAlignment') {
        if (cellValueDiv.style.justifyContent != alteredValue) throw 'compareDOM(): cellValueDiv[' + selectedRowNum + ',' + selectedColNum + '] not reflecting new ' + alteredProperty;
    } else {
        if (cellValue.style[alteredProperty] != alteredValue) throw 'compareDOM(): cellValue[' + selectedRowNum + ',' + selectedColNum + '] not reflecting new ' + alteredProperty;
    }
}

function compareStore(selectedRowNum, selectedColNum, prevPropertyObj, propertyObj, prevState, prevHistoryIndex) {
    let history = store.getState().history;

    if (prevHistoryIndex != history.changeHistoryIndex - 1) throw 'compareStore(): changeHistoryIndex not incremented correctly after event: ' + prevHistoryIndex + ' ' + history.changeHistoryIndex;

    let updatedPrevState = history.changeHistory[history.changeHistoryIndex - 1];
    assert_prevState(selectedRowNum, selectedColNum, prevPropertyObj, prevState, updatedPrevState);

    let entryKey = `\.row${selectedRowNum}\.col${selectedColNum}`;
    let currentState = history.changeHistory[history.changeHistoryIndex];
    assert_currentState(entryKey, propertyObj, currentState);
}

function assert_prevState(selectedRowNum, selectedColNum, prevPropertyObj, prevState, updatedPrevState) {
    for (const [entryKey, data] of updatedPrevState.getIndividualEntries()) {
        let updatedPrevStyleMap = data.getStyleMap();
        let prevStyleMap = prevState.getIndividualEntry(entryKey) != undefined ? prevState.getIndividualEntry(entryKey).getStyleMap() : new Map();
        if (entryKey == 'table') assert_styles_unchanged(entryKey, prevStyleMap, updatedPrevStyleMap);
        else if (entryKey.match(/\.row\d+\.col\d+$/)) { // if cell
            let updatedPrevText = data.getVal();
            let prevText = prevState.getIndividualEntry(entryKey) != undefined ? prevState.getIndividualEntry(entryKey).getVal() : null;
            let [entryRowNum, entryColNum] = entryKey.match(/\.row(\d+)\.col(\d+)/).slice(1, 3);
            if (entryRowNum != selectedRowNum || entryColNum != selectedColNum) assert_unrelatedCell_unchanged(entryKey, prevStyleMap, updatedPrevStyleMap, prevText, updatedPrevText);
            else assert_selectedCell(selectedRowNum, selectedColNum, prevPropertyObj, prevStyleMap, updatedPrevStyleMap, prevText, updatedPrevText);
        } else if (entryKey.match(/\.row\d+/) || entryKey.match(/\.col\d+/)) { // if row/col
            assert_styles_unchanged(entryKey, prevStyleMap, updatedPrevStyleMap);
        } else throw 'assert_prevState(): cellValue[' + selectedRowNum + ',' + selectedColNum + ']: unexpected entryKey: ' + entryKey;
    }
}

function assert_unrelatedCell_unchanged(entryKey, prevStyleMap, updatedPrevStyleMap, prevText, updatedPrevText) {
    assert_styles_unchanged(entryKey, prevStyleMap, updatedPrevStyleMap);
    assert_text_unchanged(entryKey, prevText, updatedPrevText);
}

// UpdatedPrevStyleMap should retain all properties from prevStyleMap. 
// The only possible difference should be the addition of prevPropertyObj to updatedPrevStyleMap.
function assert_selectedCell(selectedRowNum, selectedColNum, prevPropertyObj, prevStyleMap, updatedPrevStyleMap, prevText, updatedPrevText) {
    let [prevProperty, prevValue] = Object.entries(prevPropertyObj)[0];
    for (const [prop, val] of updatedPrevStyleMap.entries()) {
        if (prop != prevProperty && prevStyleMap.get(prop) != val) throw 'compareStore(): unrelated stylePairs of entryKey[' + selectedRowNum + ',' + selectedColNum + '] should not be changed between prevStyleMap and updatedPrevStyleMap';
        if (prop == prevProperty) {
            if (val != prevValue) throw 'compareStore(): updatedPrevStyleMap not reflecting prev ' + prevProperty + ' ' + val + ' ' + prevValue;
            if (prevProperty != 'textValue') {
                if (prevStyleMap.hasOwnProperty(prevProperty) && prevStyleMap.get(prevProperty) != prevValue) throw 'compareStore(): pre-existing ' + prevProperty + ' should not be changed from ' + prevStyleMap.get(prevProperty) + ' to ' + prevValue;
            } else {
                if (prevText != null) {
                    if (prevText != updatedPrevText) throw 'compareStore(): existing prevText not being maintained in updatedPrevText';
                }
                if (prevValue != updatedPrevText) throw 'compareStore(): expected prev textValue not being represented in updatedPrevText';
            }

        }
    }
}

function assert_currentState(entryKey, propertyObj, currentState) {
    if (Object.values(propertyObj).length != 1) throw 'assert_currentState(): unexpected/missing property param';
    if (currentState.getGroupEntriesSize() != 0) throw 'assert_currentState(): unexpected groupEntry in currentState after event';
    if (currentState.getIndividualEntriesSize() > 1) throw 'assert_currentState(): individualEntries of currentState records more than one cell';
    let cellOfCurrentState = currentState.getIndividualEntry(entryKey);
    if (cellOfCurrentState == undefined) throw 'assert_currentState(): individualEntries of currentState is missing expected cell';

    let [property, value] = Object.entries(propertyObj)[0];
    if (propertyObj.hasOwnProperty('textValue')) {
        if (cellOfCurrentState.getVal() != value) throw 'assert_currentState(): unexpected/missing value in current individualEntry';
    } else {
        if (cellOfCurrentState.getStyleMap().size != 1) throw 'assert_currentState(): unexpected/missing stylePair in current individualEntry';
        if (property != 'borders') {
            if (cellOfCurrentState.getStyleMap().get(property) != value) throw 'assert_currentState(): new ' + property + ' not stored in currentState';
        } else {
            if (!cellOfCurrentState.getStyleMap().get(property).includes(value)) throw 'assert_currentState(): new ' + property + ' not stored in currentState';
        }
    }
}

function logSuccess(testName, totalTestCases) {
    document.querySelector('#testConsoleLog').innerHTML = document.querySelector('#testConsoleLog').innerHTML + ',' + testName + `: ${totalTestCases}/${totalTestCases} PASS`;
    let testNum = document.querySelector('#testConsoleStatus').innerHTML.match(/(\d+)/)[0];
    document.querySelector('#testConsoleStatus').innerHTML = parseInt(testNum, 10) + 1 + ' NEXT';
}

function logError(errMsg) {
    document.querySelector('#testConsoleError').innerHTML = errMsg;
    let testNum = document.querySelector('#testConsoleStatus').innerHTML.match(/(\d+)/)[0];
    document.querySelector('#testConsoleStatus').innerHTML = parseInt(testNum, 10) + 1 + ' FAIL';
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////// BASEMENT /////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////

function assert_styles_unchanged(entryKey, prevStyleMap, updatedPrevStyleMap) {
    if (prevStyleMap.size != updatedPrevStyleMap.size) throw 'compareStore(): styleMap of entryKey:' + entryKey + ' should not be changed';
    for (const [prop, val] of updatedPrevStyleMap.entries()) {
        if (prevStyleMap.get(prop) != val) throw 'compareStore(): styleMap of entryKey: ' + entryKey + ' should not be changed';
    }
}

function assert_text_unchanged(entryKey, prevText, updatedPrevText) {
    if (prevText != updatedPrevText) throw 'compareStore(): text value of entryKey: ' + entryKey + ' should not be changed';
}

function assert_store_unchanged(prevHistoryIndex) {
    if (store.getState().changeHistoryIndex != prevHistoryIndex) throw 'assert_store_unchanged(): current index does not match prevHistoryIndex';
}

export { compareDOM, compareStore, assert_store_unchanged, logSuccess, logError }