import { createSlice } from '@reduxjs/toolkit'

export const selectionSlice = createSlice({
    name: 'selection',
    initialState: {
        entries: new Set(['1,1']),
        fontFamily: 'Calibri',
        fontSize: '12px',
        fontWeight: '300',
        fontStyle: 'normal',
        textDecoration: 'none',
        fontColor: 'black',
        cellColor: 'white',
        borders: [],
        horizontalAlignment: 'center',
        verticalAlignment: 'center',
    },
    reducers: {
        setSelection(state, action) {
            state.entries = new Set([...action.payload.newEntries]);
            state.fontFamily = action.payload.categories.fontFamily;
            state.fontSize = action.payload.categories.fontSize;
            state.fontWeight = action.payload.categories.fontWeight;
            state.fontStyle = action.payload.categories.fontStyle;
            state.textDecoration = action.payload.categories.textDecoration;
            state.fontColor = action.payload.categories.fontColor;
            state.cellColor = action.payload.categories.cellColor;
            state.borders = action.payload.categories.borders;
            state.horizontalAlignment = action.payload.categories.horizontalAlignment;
            state.verticalAlignment = action.payload.categories.verticalAlignment;
        },
        setFontFamily(state,action){
            state.fontFamily = action.payload.fontFamily;
        },
        setFontSize(state,action){
            state.fontSize = action.payload.fontSize;
        },
        setFontWeight(state,action){
            state.fontWeight = action.payload.fontWeight;
        },
        setFontStyle(state,action){
            state.fontStyle = action.payload.fontStyle;
        },
        setTextDecoration(state,action){
            state.textDecoration = action.payload.textDecoration;
        },
        setFontColor(state,action){
            state.fontColor = action.payload.fontColor;
        },
        setCellColor(state,action){
            state.cellColor = action.payload.cellColor;
        },
        setBorders(state,action){
            state.borders = action.payload.borders;
        },
        setHorizontalAlignment(state,action){
            state.horizontalAlignment = action.payload.horizontalAlignment;
        },
        setVerticalAlignment(state,action){
            state.verticalAlignment = action.payload.verticalAlignment;
        },
        
    }
})

export const { setSelection, setFontFamily, setFontSize, setFontWeight, setFontStyle, setTextDecoration, setFontColor, setCellColor, setBorders, setHorizontalAlignment, setVerticalAlignment } = selectionSlice.actions;

export const getSelectionEntries = state => state.selection.entries;
export const getFontFamily = state => state.selection.fontFamily;
export const getFontSize = state => state.selection.fontSize;
export const getFontWeight = state => state.selection.fontWeight;
export const getFontStyle = state => state.selection.fontStyle;
export const getTextDecoration = state => state.selection.textDecoration;
export const getFontColor = state => state.selection.fontColor;
export const getCellColor = state => state.selection.cellColor;
export const getBorders = state => state.selection.borders;
export const getHorizontalAlignment = state => state.selection.horizontalAlignment;
export const getVerticalAlignment = state => state.selection.verticalAlignment;

export default selectionSlice.reducer;