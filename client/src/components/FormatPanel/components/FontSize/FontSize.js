import React, { useEffect } from "react";
import { store } from './../../../../store/store.js'
import { useSelector } from 'react-redux';
import { getFontSize, setFontSize } from '../../../../store/reducers/selectionSlice.js';
import Data from "../../../../data/data.js";
import recordChange from "../../../../data/modifiers/recordChange.js";
import './FontSize.css'

let fontSizes = [6, 7, 8, 9, 10, 11, 12, 14, 18, 24, 36];
let options = [];
for (let i = 0; i < fontSizes.length; ++i) {
    options.push(<option key={i} value={fontSizes[i]}>{fontSizes[i]}</option>);
}

function FontSize({ selectionEntries }) {
    const fontSize = useSelector(getFontSize);

    let handleChange = (e) => {
        updateFontSize(selectionEntries, fontSize, e.target.value)
    }

    return (
        <div className='fontSize'>
            <select className='fontSize__select' value={parseInt(fontSize, 10)} onChange={handleChange}>
                {options}
            </select>
        </div>
    );
}

let updateFontSize = (selectionEntries, prevFontSize, newFontSize) => {
    let prevData = new Data();
    let newData = new Data();
    for (const cell of selectionEntries.values()) {
        let [rowNum, colNum] = cell.split(',').map((num) => parseInt(num, 10));
        prevData.setIndividualEntry('.row' + rowNum + '.col' + colNum, new Map([['fontSize', parseInt(prevFontSize, 10)]]), rowNum, colNum, null);
        newData.setIndividualEntry('.row' + rowNum + '.col' + colNum, new Map([['fontSize', parseInt(newFontSize, 10)]]), rowNum, colNum, null);
        document.querySelector(`.row${rowNum}.col${colNum}>.cellValueDiv>.cellValue`).style.fontSize = newFontSize + 'px';
    }
    recordChange(prevData, newData);
    store.dispatch(setFontSize({ fontSize: newFontSize }));
}

export { FontSize, updateFontSize };