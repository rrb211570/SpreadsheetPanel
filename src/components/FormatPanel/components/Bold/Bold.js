import React from "react";
import { store } from './../../../../store/store.js'
import { useSelector } from 'react-redux';
import { getFontWeight, setFontWeight } from '../../../../store/reducers/selectionSlice.js';
import Data from "../../../../data/data.js";
import {recordChange} from "../../../../data/modifiers/recordChange.js";
import './Bold.css'

function Bold({ selectionEntries }) {
    const fontWeight = useSelector(getFontWeight);

    let makeBold = (e) => {
        let newFontWeight;
        let prevData = new Data();
        let newData = new Data();
        for (const cell of selectionEntries.values()) {
            let [rowNum, colNum] = cell.split(',').map((num) => parseInt(num, 10));
            prevData.setIndividualEntry('.row' + rowNum + '.col' + colNum, new Map([['fontWeight', parseInt(fontWeight, 10)]]), rowNum, colNum, null);
            let cellNode = document.querySelector(`.row${rowNum}.col${colNum}>.cellValueDiv>.cellValue`);
            if (fontWeight == 700) {
                newFontWeight = 400;
                cellNode.style.fontWeight = newFontWeight;
                newData.setIndividualEntry('.row' + rowNum + '.col' + colNum, new Map([['fontWeight', newFontWeight]]), rowNum, colNum, null);
                document.querySelector('.bold__btn').style.backgroundColor = 'white';
            } else {
                newFontWeight = 700;
                cellNode.style.fontWeight = newFontWeight;
                newData.setIndividualEntry('.row' + rowNum + '.col' + colNum, new Map([['fontWeight', newFontWeight]]), rowNum, colNum, null);
                document.querySelector('.bold__btn').style.backgroundColor = 'rgb(204, 255, 162)';
            }
        }
        recordChange(prevData, newData);
        store.dispatch(setFontWeight({ fontWeight: newFontWeight }));
    }

    return (
        <div className='bold'>
            <button className='bold__btn' onClick={makeBold}>
                <p id='bold__icon'>B</p>
            </button>
        </div>
    );
}

export default Bold;