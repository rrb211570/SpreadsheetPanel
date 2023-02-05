import { createSlice } from '@reduxjs/toolkit'

export const tableDimensionsSlice = createSlice({
    name: 'tableDimensions',
    initialState: {
        height: null,
        width: null, 
        totalRows: null, 
        totalCols: null, 
    },
    reducers: {
        setTableDimensions: (state, action) => {
            state.height = action.payload.height != null ? action.payload.height : state.height;
            state.width = action.payload.width != null ? action.payload.width : state.width;
        },
        setRowsAndCols: (state, action) => {
            state.totalRows = action.payload.rows;
            state.totalCols = action.payload.cols;
        }
    }
});

export const { setTableDimensions, setRowsAndCols } = tableDimensionsSlice.actions;
export const getTableHeight = state => state.tableDimensions.height;
export const getTableWidth = state => state.tableDimensions.width;
export const getTableDimensions = state => [state.tableDimensions.height, state.tableDimensions.width];
export const getRowsAndCols = state => [state.tableDimensions.totalRows, state.tableDimensions.totalCols];

export default tableDimensionsSlice.reducer;