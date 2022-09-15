import { createSlice } from '@reduxjs/toolkit'

export const selectionSlice = createSlice({
    name: 'selection',
    initialState: { entries: [] },
    reducers: {
        setSelection(state, action) {
            state.entries = new Set([...action.payload.newEntries]);
        }
    }
})

export const { setSelection } = selectionSlice.actions;
export const getSelection = state => state.selection.entries;

export default selectionSlice.reducer;