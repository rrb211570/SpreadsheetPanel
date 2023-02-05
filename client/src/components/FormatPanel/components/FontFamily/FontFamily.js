import React from "react";
import { store } from './../../../../store/store.js'
import { useSelector } from 'react-redux';
import { getFontFamily, setFontFamily } from '../../../../store/reducers/selectionSlice.js';
import Data from "../../../../data/data.js";
import recordChange from "../../../../data/modifiers/recordChange.js";
import './FontFamily.css'

let fonts = ['Calibri', 'Times New Roman', 'Ebrima', 'Century Gothic'];
let options = [];
for (let i = 0; i < fonts.length; ++i) {
    options.push(<option key={i} value={fonts[i]}>{fonts[i]}</option>);
}

function FontFamily({ selectionEntries }) {
    const fontFamily = useSelector(getFontFamily);

    let handleChange = (e) => {
        updateFontFamily(selectionEntries, fontFamily, e.target.value)
    }

    return (
        <div className='fontFamily'>
            <select className='fontFamily__select' value={fontFamily} onChange={handleChange}>
                {options}
            </select>
        </div>
    );
}

function updateFontFamily(selectionEntries, prevFontFamily, newFontFamily) {
    let prevData = new Data();
    let newData = new Data();
    for (const cell of selectionEntries.values()) {
        let [rowNum, colNum] = cell.split(',').map((num) => parseInt(num, 10));
        prevData.setIndividualEntry('.row' + rowNum + '.col' + colNum, new Map([['fontFamily', prevFontFamily]]), rowNum, colNum, null);
        newData.setIndividualEntry('.row' + rowNum + '.col' + colNum, new Map([['fontFamily', newFontFamily]]), rowNum, colNum, null);
        document.querySelector(`.row${rowNum}.col${colNum}>.cellValueDiv>.cellValue`).style.fontFamily = newFontFamily;
    }
    recordChange(prevData, newData);
    store.dispatch(setFontFamily({ fontFamily: newFontFamily }));
}

export { FontFamily, updateFontFamily };