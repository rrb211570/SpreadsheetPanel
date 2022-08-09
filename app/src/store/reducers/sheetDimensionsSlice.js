import { createSlice } from '@reduxjs/toolkit'

export const sheetDimensionsSlice = createSlice({
    name: 'sheetDimensions',
    initialState: { tableHeight: null, tableWidth: null },
    reducers: {
        setSheetDimensions: (state, action) => {
            state.tableHeight = action.payload.tableHeight != null ? action.payload.tableHeight : state.tableHeight;
            state.tableWidth = action.payload.tableWidth != null ? action.payload.tableWidth : state.tableWidth;
        }
    }
});

export const { setSheetDimensions } = sheetDimensionsSlice.actions;
export const getTableHeight = state => state.sheetDimensions.tableHeight;
export const getTableWidth = state => state.sheetDimensions.tableWidth;
export const getSheetDimensions = state => [state.sheetDimensions.tableHeight, state.sheetDimensions.tableWidth];

export default sheetDimensionsSlice.reducer;