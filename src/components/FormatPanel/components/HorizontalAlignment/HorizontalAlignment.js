import React, { useState } from "react";
import { store } from '../../../../store/store.js'
import { useSelector } from 'react-redux';
import { getHorizontalAlignment, setHorizontalAlignment } from '../../../../store/reducers/selectionSlice.js';
import Data from "../../../../data/data.js";
import {recordChange} from "../../../../data/modifiers/recordChange.js";
import './HorizontalAlignment.css'

function HorizontalAlignment({ selectionEntries }) {
    const [insideDropdown, setInsideDropdown] = useState(false);
    const horizontalAlignment = useSelector(getHorizontalAlignment);

    let toggleDropdown = (e) => {
        let dropdown = e.target.parentElement.querySelector('.horizontalAlignment__options');
        if (dropdown.style.opacity == 1) {
            dropdown.style.opacity = 0;
            dropdown.style.zIndex = -1;
            dropdown.style.pointerEvents = 'none';
        } else {
            dropdown.style.opacity = 1;
            dropdown.style.zIndex = 3;
            dropdown.style.pointerEvents = 'auto';
        }
    }

    let recordMouseEnter = () => {
        setInsideDropdown(true);
    }

    let recordMouseLeave = () => {
        setInsideDropdown(false);
    }

    let hideDropdown = (e) => {
        if (!insideDropdown) {
            e.currentTarget.querySelector('.horizontalAlignment__options').style.opacity = 0;
            e.currentTarget.querySelector('.horizontalAlignment__options').style.zIndex = -1;
            e.currentTarget.querySelector('.horizontalAlignment__options').style.pointerEvents = 'none';
        }
    }

    return (
        <div className='horizontalAlignment' tabIndex='-1' onMouseEnter={recordMouseEnter} onMouseLeave={recordMouseLeave} onBlur={hideDropdown} >
            <button className={`horizontalAlignment__btn horizontalAlignment__icon_${horizontalAlignment}`} onClick={toggleDropdown}>
                <p className='horizontalAlignment__iconLine_long horizontalAlignment__iconLine'></p>
                <p className='horizontalAlignment__iconLine_short horizontalAlignment__iconLine'></p>
                <p className='horizontalAlignment__iconLine_long horizontalAlignment__iconLine'></p>
                <p className='horizontalAlignment__iconLine_short horizontalAlignment__iconLine'></p>
            </button>
            <div className='horizontalAlignment__options' >
                <div id='horizontalAlignment__left' className='horizontalAlignment__icon_left horizontalAlignment__icon' onClick={()=>updateHorizontalAlignment(selectionEntries, horizontalAlignment, 'left')}>
                    <p className='horizontalAlignment__iconLine_long horizontalAlignment__iconLine'></p>
                    <p className='horizontalAlignment__iconLine_short horizontalAlignment__iconLine'></p>
                    <p className='horizontalAlignment__iconLine_long horizontalAlignment__iconLine'></p>
                    <p className='horizontalAlignment__iconLine_short horizontalAlignment__iconLine'></p>
                </div>
                <div id='horizontalAlignment__center' className='horizontalAlignment__icon_center horizontalAlignment__icon' onClick={()=>updateHorizontalAlignment(selectionEntries, horizontalAlignment, 'center')}>
                    <p className='horizontalAlignment__iconLine_long horizontalAlignment__iconLine'></p>
                    <p className='horizontalAlignment__iconLine_short horizontalAlignment__iconLine'></p>
                    <p className='horizontalAlignment__iconLine_long horizontalAlignment__iconLine'></p>
                    <p className='horizontalAlignment__iconLine_short horizontalAlignment__iconLine'></p>
                </div>
                <div id='horizontalAlignment__right' className='horizontalAlignment__icon_right horizontalAlignment__icon' onClick={()=>updateHorizontalAlignment(selectionEntries, horizontalAlignment, 'right')}>
                    <p className='horizontalAlignment__iconLine_long horizontalAlignment__iconLine'></p>
                    <p className='horizontalAlignment__iconLine_short horizontalAlignment__iconLine'></p>
                    <p className='horizontalAlignment__iconLine_long horizontalAlignment__iconLine'></p>
                    <p className='horizontalAlignment__iconLine_short horizontalAlignment__iconLine'></p>
                </div>
            </div>
        </div>
    );
}

let updateHorizontalAlignment = (selectionEntries, prevHorizontalAlignment, newHorizontalAlignment) => {
    let prevData = new Data();
    let newData = new Data();
    if (prevHorizontalAlignment == newHorizontalAlignment) return;
    for (const cell of selectionEntries.values()) {
        let [rowNum, colNum] = cell.split(',').map((num) => parseInt(num, 10));
        prevData.setIndividualEntry('.row' + rowNum + '.col' + colNum, new Map([['horizontalAlignment', prevHorizontalAlignment]]), rowNum, colNum, null);
        newData.setIndividualEntry('.row' + rowNum + '.col' + colNum, new Map([['horizontalAlignment', newHorizontalAlignment]]), rowNum, colNum, null);
        document.querySelector(`.row${rowNum}.col${colNum}>.cellValueDiv>.cellValue`).style.textAlign = newHorizontalAlignment;
    }
    recordChange(prevData, newData);
    store.dispatch(setHorizontalAlignment({ horizontalAlignment: newHorizontalAlignment }));
}

export {HorizontalAlignment, updateHorizontalAlignment};