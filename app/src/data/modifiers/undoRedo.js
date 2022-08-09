import { updateSheetDimensions, applyChange, applyGroupChange } from './applyChange.js';
import updateCollectedData from './updateCollectedData.js';
import { store } from './../../store/store.js'
import { undo as undoAction, redo as redoAction } from './../../store/reducers/historySlice.js'

const UNDO = 'Undo';
const REDO = 'Redo';

function undo() {
    let historyState = store.getState().history;
    if (historyState.changeHistoryIndex > 0) {
        if (this.state.testingKeyInput) this.setState({ keyOutcome: UNDO, timeTravelCounter: this.state.timeTravelCounter + 1 });
        for (const [entryKey, data] of historyState.changeHistory[historyState.changeHistoryIndex - 1].getIndividualEntries()) {
            if (entryKey == 'spreadsheet') updateSheetDimensions(data.getStyleMap());
            else if (!/\.col\d+/.test(entryKey)) {
                let entry = document.getElementById(entryKey.match(/\.row\d+/));
                applyChange(entry, data.getStyleMap());
            } else {
                let entry = document.querySelector(entryKey.match(/\.row\d+\.col\d+$/));
                applyChange(entry, data.getStyleMap(), data.getVal());
            }
        }
        for (const [group, styleMap] of historyState.changeHistory[historyState.changeHistoryIndex - 1].getGroupEntries()) {
            applyGroupChange(group, styleMap);
        }
        let updatedCollectedData = updateCollectedData(historyState.changeHistory[historyState.changeHistoryIndex - 1], historyState.collectedData);
        console.log('Undo\nchangeHistoryIndex: ' + (historyState.changeHistoryIndex - 1));
        store.dispatch(undoAction({ collectedData: updatedCollectedData }));
    } else if (this.state.testingKeyInput) this.setState({ keyOutcome: UNDO });
}
function redo() {
    let historyState = store.getState().history;
    if (historyState.changeHistoryIndex < historyState.changeHistory.length - 1) {
        if (this.state.testingKeyInput) this.setState({ keyOutcome: REDO, timeTravelCounter: this.state.timeTravelCounter + 1 });
        let updatedCollectedData = historyState.collectedData;
        for (const [entryKey, data] of historyState.changeHistory[historyState.changeHistoryIndex + 1].getIndividualEntries()) {
            if (entryKey == 'spreadsheet') {
                updateSheetDimensions(data.getStyleMap(), historyState.updateSheetDimensions);
            } else if (!/\.col\d+/.test(entryKey)) {
                let entry = document.getElementById(entryKey.match(/\.row\d+$/));
                applyChange(entry, data.getStyleMap());
            } else {
                let entry = document.querySelector(entryKey.match(/\.row\d+\.col\d+$/));
                applyChange(entry, data.getStyleMap(), data.getVal())
            }
        }
        for (const [group, styleMap] of historyState.changeHistory[historyState.changeHistoryIndex + 1].getGroupEntries()) {
            applyGroupChange(group, styleMap);
        }
        updatedCollectedData = updateCollectedData(historyState.changeHistory[historyState.changeHistoryIndex + 1], historyState.collectedData);
        console.log('Redo\nchangeHistoryIndex: ' + (historyState.changeHistoryIndex + 1));
        store.dispatch(redoAction({ collectedData: updatedCollectedData }));
    } else if (this.state.testingKeyInput) this.setState({ keyOutcome: REDO });
}
export { undo, redo }