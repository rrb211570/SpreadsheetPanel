import { createSlice } from '@reduxjs/toolkit'
import Data from '../../data/data.js'

export const historySlice = createSlice({
    name: 'history',
    initialState: {
        changeHistory: [new Data()],
        changeHistoryIndex: 0,
        collectedData: new Data(),
        sentData: new Data()
    },
    reducers: {
        newHistoryState(state, action) {
            state.changeHistory = [...state.changeHistory.slice(0, state.changeHistoryIndex), action.payload.prevRecordedData, action.payload.dataAfterChange];
            state.changeHistoryIndex = state.changeHistoryIndex + 1;
            state.collectedData = action.payload.collectedData;
            state.sentData = state.sentData;
        },
        undo(state, action) {
            state.changeHistory = state.changeHistory;
            state.changeHistoryIndex = state.changeHistoryIndex - 1;
            state.collectedData = action.payload.collectedData;
            state.sentData = state.sentData;
        },
        redo(state, action) {
            state.changeHistory = state.changeHistory;
            state.changeHistoryIndex = state.changeHistoryIndex + 1;
            state.collectedData = action.payload.collectedData;
            state.sentData = state.sentData;
        },
        clearHistory(state, action) {
            state.changeHistory = [new Data()];
            state.changeHistoryIndex = 0;
            state.collectedData = new Data();
            state.sentData = new Data();

        },
        save(state, action) {
            state.changeHistory = state.changeHistory;
            state.changeHistoryIndex = state.changeHistoryIndex;
            state.collectedData = new Data();
            state.sentData = state.collectedData;

        },
        rollBackAndMerge(state, action) {
            state.changeHistory = state.changeHistory;
            state.changeHistoryIndex = state.changeHistoryIndex;
            state.collectedData = merge(state.collectedData, state.sentData);
            state.sentData = new Data();

        }
    }
});

function merge(collectedData, savedData) {
    return savedData; // should merge with collectedData as well
}

export const { newHistoryState, undo, redo, clearHistory, save, rollBackAndMerge } = historySlice.actions;
export const getChangeHistory = state => state.history.changeHistory;
export const getChangeHistoryIndex = state => state.history.changeHistoryIndex;
export const getCollectedData = state => state.history.collectedData;
export const getSentData = state => state.history.sentData;
export default historySlice.reducer;