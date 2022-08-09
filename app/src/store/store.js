import { configureStore } from '@reduxjs/toolkit'

import { newHistoryState, undo, redo, clearHistory, save, rollBackAndMerge} from './reducers/historySlice.js'
import { setSelection } from './reducers/selectionSlice.js'
import { setSheetDimensions } from './reducers/sheetDimensionsSlice.js'

import historyReducer from './reducers/historySlice.js'
import selectionReducer from './reducers/selectionSlice.js'
import sheetDimensionsReducer from './reducers/sheetDimensionsSlice.js'

const mapStateToProps = (state) => {
    return {
        changeHistory: state.history.changeHistory,
        changeHistoryIndex: state.history.changeHistoryIndex,
        collectedData: state.history.collectedData,
        sentData: state.history.sentData,
        selectionEntries: state.selection.entries,
        tableHeight: state.sheetDimensions.tableHeight,
        tableWidth: state.sheetDimensions.tableWidth,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
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
        setSelection: (entries) => {
            dispatch(setSelection(entries));
        },
        setSheetDimensions: (height, width) => {
            dispatch(setSheetDimensions(height, width));
        },
        
    }
};

const store = configureStore({
    reducer: {
        history: historyReducer,
        selection: selectionReducer,
        sheetDimensions: sheetDimensionsReducer,
    },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['history/newHistoryState'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.prevRecordedData', 'payload.collectedData'],
        // Ignore these paths in the state
        ignoredPaths: ['history.changeHistory', 'history.collectedData', 'history.sentData'],
      },
    })
})

export { store, mapStateToProps, mapDispatchToProps};