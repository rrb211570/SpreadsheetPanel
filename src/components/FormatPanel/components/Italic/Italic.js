import React from "react";
import { store } from './../../../../store/store.js'
import { useSelector } from 'react-redux';
import { getFontStyle, setFontStyle } from '../../../../store/reducers/selectionSlice.js';
import Data from "../../../../data/data.js";
import recordChange from "../../../../data/modifiers/recordChange.js";
import './Italic.css'

function Italic({ selectionEntries }) {
    const fontStyle = useSelector(getFontStyle);

    let toggleItalic = (e) => {
        let newFontStyle;
        let prevData = new Data();
        let newData = new Data();
        for (const cell of selectionEntries.values()) {
            let [rowNum, colNum] = cell.split(',').map((num) => parseInt(num, 10));
            prevData.setIndividualEntry('.row' + rowNum + '.col' + colNum, new Map([['fontStyle', fontStyle]]), rowNum, colNum, null);
            let cellNode = document.querySelector(`.row${rowNum}.col${colNum}>.cellValueDiv>.cellValue`);
            if (fontStyle == 'italic') {
                newFontStyle = 'normal';
                cellNode.style.fontStyle = newFontStyle;
                newData.setIndividualEntry('.row' + rowNum + '.col' + colNum, new Map([['fontStyle', newFontStyle]]), rowNum, colNum, null);
                document.querySelector('.italic__btn').style.backgroundColor = 'white';
            } else {
                newFontStyle = 'italic';
                cellNode.style.fontStyle = newFontStyle;
                newData.setIndividualEntry('.row' + rowNum + '.col' + colNum, new Map([['fontStyle', newFontStyle]]), rowNum, colNum, null);
                document.querySelector('.italic__btn').style.backgroundColor = 'rgb(204, 255, 162)';
            }
        }
        recordChange(prevData, newData);
        store.dispatch(setFontStyle({ fontStyle: newFontStyle }));
    }

    return (
        <div className='italic'>
            <button className='italic__btn' onClick={toggleItalic}>
                <p id='italic__icon'>I</p>
            </button>
        </div>
    );
}

export default Italic;