import { createSlice } from '@reduxjs/toolkit'

export const selectionSlice = createSlice({
    name: 'selection',
    initialState: { entries: [] },
    reducers: {
        setSelection(state, action) {
            state = {
                entries: action.entries
            }
        }
    }
})

export const { setSelection } = selectionSlice.actions;
export const getSelection = state => state.selection.entries;

export default selectionSlice.reducer;