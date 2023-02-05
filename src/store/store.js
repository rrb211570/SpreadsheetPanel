import { configureStore } from '@reduxjs/toolkit'

import { loadSheet, newHistoryState, undo, redo, clearHistory, save, rollBackAndMerge } from './reducers/historySlice.js'
import { setSelection } from './reducers/selectionSlice.js'
import { enableTest, trackEvent } from './reducers/keyboardEventsSlice.js'
import { setTableDimensions } from './reducers/tableDimensionsSlice.js'

import historyReducer from './reducers/historySlice.js'
import selectionReducer from './reducers/selectionSlice.js'
import keyboardEventsReducer from './reducers/keyboardEventsSlice.js'
import tableDimensionsReducer from './reducers/tableDimensionsSlice.js'

const mapStateToProps = (state) => {
    return {
        loadedSheet: state.history.loadedSheet,
        changeHistory: state.history.changeHistory,
        changeHistoryIndex: state.history.changeHistoryIndex,
        collectedData: state.history.collectedData,
        sentData: state.history.sentData,

        selectionEntries: state.selection.entries,

        inputMode: state.keyboardEvents.inputMode,
        enableTest: state.keyboardEvents.enableTest,
        outcome: state.keyboardEvents.outcome,
        timeTravelCounter: state.keyboardEvents.timeTravelCounter,

        tableHeight: state.tableDimensions.height,
        tableWidth: state.tableDimensions.width,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        loadSheet: (sheet) => {
            dispatch(loadSheet(sheet));
        },
        newHistoryState: (prevRecordedData, dataAfterChange, collectedData) => {
            dispatch(newHistoryState(prevRecordedData, dataAfterChange, collectedData));
        },
        undo: (collectedData) => {
            dispatch(undo(collectedData));
        },
        redo: (collectedData) => {
            dispatch(redo(collectedData));
        },
        clearHistoryState: () => {
            dispatch(clearHistory());
        },
        save: () => {
            dispatch(save());
        },
        rollBackAndMerge: () => {
            dispatch(rollBackAndMerge());
        },
        setSelection: (entries, categories) => {
            dispatch(setSelection(entries, categories));
        },
        enableTest: (enableTest) => {
            dispatch(enableTest(enableTest));
        },
        trackEvent: (inputMode, outcome, timeTravelCounter) => {
            dispatch(trackEvent(inputMode, outcome, timeTravelCounter))
        },
        setTableDimensions: (height, width) => {
            dispatch(setTableDimensions(height, width));
        },

    }
};

const store = configureStore({
    reducer: {
        history: historyReducer,
        selection: selectionReducer,
        keyboardEvents: keyboardEventsReducer,
        tableDimensions: tableDimensionsReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore these action types
                ignoredActions: ['history/newHistoryState'],
                // Ignore these field paths in all actions
                ignoredActionPaths: ['payload.prevRecordedData', 'payload.collectedData'],
                // Ignore these paths in the state
                ignoredPaths: ['history.changeHistory', 'history.collectedData', 'history.sentData', 'selection.entries'],
            },
        })
})

export { store, mapStateToProps, mapDispatchToProps };