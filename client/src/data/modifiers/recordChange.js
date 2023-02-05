import Data from '../data.js';
import updateCollectedData from './updateCollectedData.js';
import {store} from '../../store/store.js'
import {newHistoryState} from '../../store/reducers/historySlice.js'

function recordChange(dataBeforeChange, dataAfterChange) {
    let history = store.getState().history;
    let prevRecordedData = updatePrevRecordedData(history.changeHistory[history.changeHistoryIndex], dataBeforeChange);
    let updatedCollectedData = updateCollectedData(dataAfterChange, history.collectedData);
    store.dispatch(newHistoryState({prevRecordedData, dataAfterChange, collectedData: updatedCollectedData}));
}
function updatePrevRecordedData(prevData, dataBeforeChange) {
    let updatedPrevData = new Data();
    for (const [entryKey, data] of dataBeforeChange.getIndividualEntries()) {
        let styleMap = new Map();
        if (prevData.hasIndividualEntry(entryKey)) {
            styleMap = prevData.getIndividualEntry(entryKey).getStyleMap();
        }
        for (const [property, val] of data.getStyleMap().entries()) styleMap.set(property, val);
        let args = [entryKey, styleMap];
        if (entryKey != 'table' && !/\.col\d+/.test(entryKey)) args.push(data.getRow());
        if (/\.col\d+/.test(entryKey)) {
            args.push(data.getCellRow(), data.getCellCol());
            if (prevData.hasIndividualEntry(entryKey)) args.push(prevData.getIndividualEntry(entryKey).getVal());
            else args.push(data.getVal());
        }
        updatedPrevData.setIndividualEntry(...args);
    }
    for (const [entryKey, data] of prevData.getIndividualEntries()) {
        let args = [entryKey, data.getStyleMap()];
        if (entryKey != 'table' && !/\.col\d+/.test(entryKey)) args.push(data.getRow());
        if (/\.col\d+/.test(entryKey)) args.push(data.getCellRow(), data.getCellCol(), data.getVal());
        if (!updatedPrevData.hasIndividualEntry(entryKey)) updatedPrevData.setIndividualEntry(...args);
    }
    // group entries
    for (const [group, styleMap] of dataBeforeChange.getGroupEntries()) {
        let updatedStyleMap = new Map();
        if (prevData.hasGroup(group)) {
            updatedStyleMap = prevData.getGroup(group);
        }
        for (const [property, val] of styleMap.entries()) updatedStyleMap.set(property, val);
        updatedPrevData.setGroup(group, updatedStyleMap);
    }
    for (const [group, styleMap] of prevData.getGroupEntries()) {
        if (!updatedPrevData.hasGroup(group)) updatedPrevData.setGroup(group, styleMap);
    }
    return updatedPrevData;
}

export default recordChange;