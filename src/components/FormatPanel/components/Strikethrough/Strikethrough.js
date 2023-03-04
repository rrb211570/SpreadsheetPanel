import React from "react";
import { store } from './../../../../store/store.js'
import { useSelector } from 'react-redux';
import { getTextDecoration, setTextDecoration } from '../../../../store/reducers/selectionSlice.js';
import Data from "../../../../data/data.js";
import {recordChange} from "../../../../data/modifiers/recordChange.js";
import './Strikethrough.css'

function Strikethrough({ selectionEntries }) {
    const textDecoration = useSelector(getTextDecoration);

    let toggleStrikethrough = (e) => {
        let newTextDecoration;
        let prevData = new Data();
        let newData = new Data();
        for (const cell of selectionEntries.values()) {
            let [rowNum, colNum] = cell.split(',').map((num) => parseInt(num, 10));
            prevData.setIndividualEntry('.row' + rowNum + '.col' + colNum, new Map([['textDecoration', textDecoration]]), rowNum, colNum, null);
            let cellNode = document.querySelector(`.row${rowNum}.col${colNum}>.cellValueDiv>.cellValue`);
            if (textDecoration == 'line-through') {
                newTextDecoration = 'none';
                cellNode.style.textDecoration = newTextDecoration;
                newData.setIndividualEntry('.row' + rowNum + '.col' + colNum, new Map([['textDecoration', newTextDecoration]]), rowNum, colNum, null);
                document.querySelector('.strikethrough__btn').style.backgroundColor = 'white';
            } else {
                newTextDecoration = 'line-through';
                cellNode.style.textDecoration = newTextDecoration;
                newData.setIndividualEntry('.row' + rowNum + '.col' + colNum, new Map([['textDecoration', newTextDecoration]]), rowNum, colNum, null);
                document.querySelector('.strikethrough__btn').style.backgroundColor = 'rgb(204, 255, 162)';
            }
        }
        recordChange(prevData, newData);
        store.dispatch(setTextDecoration({ textDecoration: newTextDecoration }));
    }

    return (
        <div className='strikethrough'>
            <button className='strikethrough__btn' onClick={toggleStrikethrough}>
                <p id='strikethrough__icon'>S</p>
            </button>
        </div>
    );
}

export default Strikethrough;