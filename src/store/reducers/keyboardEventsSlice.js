import { createSlice } from '@reduxjs/toolkit'

const NO_COMMAND = 'No Command';
const NO_CHANGE = 'No Change'
export const keyboardEventsSlice = createSlice({
    name: 'keyboardEvents',
    initialState: {
        inputMode: NO_COMMAND,
        enableTest: true,
        outcome: NO_CHANGE,
        timeTravelCounter: 0 // used only for testing purposes in undo/redo()
    },
    reducers: {
        enableTest(state, action) {
            state.inputMode = state.inputMode;
            state.enableTest = action.enableTest;
            state.outcome = state.outcome;
            state.timeTravelCounter = state.timeTravelCounter;
        },
        trackEvent(state, action) {
            if(action.payload.inputMode!=undefined) state.inputMode = action.payload.inputMode;
            if(action.payload.outcome!=undefined) state.outcome = action.payload.outcome;
            if(action.payload.timeTravelCounter!=undefined) state.timeTravelCounter = action.payload.timeTravelCounter;
        }
    }
})

export const { enableTest, trackEvent } = keyboardEventsSlice.actions;
export const getKeyEventState = state => [state.keyboardEvents.inputMode, state.keyboardEvents.enableTest, state.keyboardEvents.outcome, state.keyboardEvents.timeTravelCounter];

export default keyboardEventsSlice.reducer;