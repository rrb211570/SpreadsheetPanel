import { updateSheetDimensions, applyChange, applyGroupChange } from './applyChange.js';
import updateCollectedData from './updateCollectedData.js';
import { store } from './../../store/store.js'
import { trackEvent } from "./../../store/reducers/keyboardEventsSlice.js";
import { undo as undoAction, redo as redoAction } from './../../store/reducers/historySlice.js'

const UNDO = 'Undo';
const REDO = 'Redo';

function undo() {
    const storeState = store.getState();
    const changeHistoryIndex = storeState.history.changeHistoryIndex;
    const changeHistory = storeState.history.changeHistory;
    const collectedData = storeState.history.collectedData;
    const enableTest = storeState.keyboardEvents.enableTest;
    const timeTravelCounter = storeState.keyboardEvents.timeTravelCounter;
    if (changeHistoryIndex > 0) {
        if (enableTest) store.dispatch(trackEvent({ outcome: UNDO, timeTravelCounter: timeTravelCounter + 1 }));
        for (const [entryKey, data] of changeHistory[changeHistoryIndex - 1].getIndividualEntries()) {
            if (entryKey == 'spreadsheet') updateSheetDimensions(data.getStyleMap());
            else if (!/\.col\d+/.test(entryKey)) {
                let entry = document.getElementById(entryKey.match(/\.row\d+/));
                applyChange(entry, data.getStyleMap());
            } else {
                let entry = document.querySelector(entryKey.match(/\.row\d+\.col\d+$/));
                applyChange(entry, data.getStyleMap(), data.getVal());
            }
        }
        for (const [group, styleMap] of changeHistory[changeHistoryIndex - 1].getGroupEntries()) {
            applyGroupChange(group, styleMap);
        }
        let updatedCollectedData = updateCollectedData(changeHistory[changeHistoryIndex - 1], collectedData);
        console.log('Undo\nchangeHistoryIndex: ' + (changeHistoryIndex - 1));
        store.dispatch(undoAction({ collectedData: updatedCollectedData }));
    } else if (enableTest) store.dispatch(trackEvent({ outcome: UNDO }));
}

function redo() {
    const storeState = store.getState();
    const changeHistoryIndex = storeState.history.changeHistoryIndex;
    const changeHistory = storeState.history.changeHistory;
    const collectedData = storeState.history.collectedData;
    const enableTest = storeState.keyboardEvents.enableTest;
    const timeTravelCounter = storeState.keyboardEvents.timeTravelCounter;
    if (changeHistoryIndex < changeHistory.length - 1) {
        if (enableTest) store.dispatch(trackEvent({ outcome: REDO, timeTravelCounter: timeTravelCounter + 1 }));
        for (const [entryKey, data] of changeHistory[changeHistoryIndex + 1].getIndividualEntries()) {
            if (entryKey == 'spreadsheet') {
                updateSheetDimensions(data.getStyleMap(), updateSheetDimensions);
            } else if (!/\.col\d+/.test(entryKey)) {
                let entry = document.getElementById(entryKey.match(/\.row\d+$/));
                applyChange(entry, data.getStyleMap());
            } else {
                let entry = document.querySelector(entryKey.match(/\.row\d+\.col\d+$/));
                applyChange(entry, data.getStyleMap(), data.getVal())
            }
        }
        for (const [group, styleMap] of changeHistory[changeHistoryIndex + 1].getGroupEntries()) {
            applyGroupChange(group, styleMap);
        }
        let updatedCollectedData = updateCollectedData(changeHistory[changeHistoryIndex + 1], collectedData);
        console.log('Redo\nchangeHistoryIndex: ' + (changeHistoryIndex + 1));
        store.dispatch(redoAction({ collectedData: updatedCollectedData }));
    } else if (enableTest) store.dispatch(trackEvent({ outcome: REDO }));
}
export { undo, redo }