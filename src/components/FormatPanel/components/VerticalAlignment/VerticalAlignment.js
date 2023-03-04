import React, { useState } from "react";
import { store } from '../../../../store/store.js'
import { useSelector } from 'react-redux';
import { getVerticalAlignment, setVerticalAlignment } from '../../../../store/reducers/selectionSlice.js';
import Data from "../../../../data/data.js";
import {recordChange} from "../../../../data/modifiers/recordChange.js";
import './VerticalAlignment.css'

function VerticalAlignment({ selectionEntries }) {
    const [insideDropdown, setInsideDropdown] = useState(false);
    const verticalAlignment = useSelector(getVerticalAlignment);

    let toggleDropdown = (e) => {
        let dropdown = e.target.parentElement.querySelector('.verticalAlignment__options');
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
            e.currentTarget.querySelector('.verticalAlignment__options').style.opacity = 0;
            e.currentTarget.querySelector('.verticalAlignment__options').style.zIndex = -1;
            e.currentTarget.querySelector('.verticalAlignment__options').style.pointerEvents = 'none';
        }
    }

    let handleChange = (e) => {
        let newVerticalAlignment = e.target.id.match(/verticalAlignment__(.*)/)[1];
        updateVerticalAlignment(selectionEntries, verticalAlignment, newVerticalAlignment);
    }

    return (
        <div className='verticalAlignment' tabIndex='-1' onMouseEnter={recordMouseEnter} onMouseLeave={recordMouseLeave} onBlur={hideDropdown} >
            <button className='verticalAlignment__btn verticalAlignment__icon' onClick={toggleDropdown}>
                <img src={`${verticalAlignment}.png`} alt={verticalAlignment + ' alignment'} />
            </button>
            <div className='verticalAlignment__options'>
                <div id='verticalAlignment__top' className='verticalAlignment__icon' onClick={handleChange}>
                    <img src='top.png' alt='top alignment' />
                </div>
                <div id='verticalAlignment__center' className='verticalAlignment__icon' onClick={handleChange}>
                    <img src='center.png' alt='center vertical alignment' />
                </div>
                <div id='verticalAlignment__bottom' className='verticalAlignment__icon' onClick={handleChange}>
                    <img src='bottom.png' alt='bottom alignment' />
                </div>
            </div>
        </div>
    );
}

let updateVerticalAlignment = (selectionEntries, prevVerticalAlignment, newVerticalAlignment) => {
    let prevData = new Data();
    let newData = new Data();
    if (prevVerticalAlignment == newVerticalAlignment) return;
    for (const cell of selectionEntries.values()) {
        let [rowNum, colNum] = cell.split(',').map((num) => parseInt(num, 10));
        prevData.setIndividualEntry('.row' + rowNum + '.col' + colNum, new Map([['verticalAlignment', prevVerticalAlignment]]), rowNum, colNum, null);
        newData.setIndividualEntry('.row' + rowNum + '.col' + colNum, new Map([['verticalAlignment', newVerticalAlignment]]), rowNum, colNum, null);
        document.querySelector(`.row${rowNum}.col${colNum}>.cellValueDiv`).style.justifyContent = parseVerticalAlignment(newVerticalAlignment);
    }
    recordChange(prevData, newData);
    store.dispatch(setVerticalAlignment({ verticalAlignment: newVerticalAlignment }));
}

let parseVerticalAlignment = (term) => {
    switch (term) {
        case 'top': return 'flex-start';
        case 'center': return 'center';
        case 'bottom': return 'flex-end';
        default: break;
    }
    return 'parseVerticalAlignment(): invalid term';
}

export { VerticalAlignment, updateVerticalAlignment, parseVerticalAlignment };