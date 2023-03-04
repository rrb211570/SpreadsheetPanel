import React, { useState } from "react";
import { store } from './../../../../store/store.js'
import { useSelector } from 'react-redux';
import { getBorders, setBorders } from '../../../../store/reducers/selectionSlice.js';
import Data from "../../../../data/data.js";
import {recordChange} from "../../../../data/modifiers/recordChange.js";
import './Borders.css'

function Borders({ selectionEntries }) {
    const [insideDropdown, setInsideDropdown] = useState(false);
    const selectedBorders = useSelector(getBorders);

    let toggleDropdown = (e) => {
        let borderOptions = e.target.parentElement.querySelector('.borders__options');
        if (borderOptions.style.opacity == 1) {
            borderOptions.style.opacity = 0;
            borderOptions.style.zIndex = -1;
            borderOptions.style.pointerEvents = 'none';
        } else {
            borderOptions.style.opacity = 1;
            borderOptions.style.zIndex = 5;
            borderOptions.style.pointerEvents = 'auto';
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
            e.currentTarget.querySelector('.borders__options').style.opacity = 0;
            e.currentTarget.querySelector('.borders__options').style.zIndex = -1;
            e.currentTarget.querySelector('.borders__options').style.pointerEvents = 'none';
        }
    }

    return (
        <div className='borders' tabIndex='-1' onMouseEnter={recordMouseEnter} onMouseLeave={recordMouseLeave} onBlur={hideDropdown} >
            <button className='borders__btn' onClick={toggleDropdown}>
                <img id='borders__btnIcon' src='borderIcon.png' alt='borders icon' />
            </button>
            <div className='borders__options' >
                <p onClick={() => updateBorders(selectionEntries, selectedBorders, 'top')} style={{ backgroundColor: selectedBorders.filter(opt => opt == 'top').length > 0 ? 'rgb(204, 255, 162)' : 'white' }}>top</p>
                <p onClick={() => updateBorders(selectionEntries, selectedBorders, 'bottom')} style={{ backgroundColor: selectedBorders.filter(opt => opt == 'bottom').length > 0 ? 'rgb(204, 255, 162)' : 'white' }}>bottom</p>
                <p onClick={() => updateBorders(selectionEntries, selectedBorders, 'left')} style={{ backgroundColor: selectedBorders.filter(opt => opt == 'left').length > 0 ? 'rgb(204, 255, 162)' : 'white' }}>left</p>
                <p onClick={() => updateBorders(selectionEntries, selectedBorders, 'right')} style={{ backgroundColor: selectedBorders.filter(opt => opt == 'right').length > 0 ? 'rgb(204, 255, 162)' : 'white' }}>right</p>
                <p onClick={() => updateBorders(selectionEntries, selectedBorders, 'none')}>none</p>
            </div>
        </div>
    );
}

function updateBorders(selectionEntries, prevBorders, borderOption) {
    if (borderOption == 'none') {
        updateDOM(selectionEntries, prevBorders, ['none']);
        return;
    }
    let newBorders = createNewBorders(prevBorders, borderOption);
    updateDOM(selectionEntries, prevBorders, newBorders);
}

function createNewBorders(prevBorders, borderOption) {
    let newBorders = [...prevBorders.filter(opt => opt != 'none')];
    if (newBorders.filter(opt => opt == borderOption).length > 0) {
        newBorders = newBorders.filter(opt => opt != borderOption);
    } else newBorders.push(borderOption);
    if (newBorders.length == 0) newBorders = ['none'];
    return newBorders;
}

function updateDOM(selectionEntries, prevBorders, newBorders) {
    let prevData = new Data();
    let newData = new Data();
    for (const cell of selectionEntries.values()) {
        let [rowNum, colNum] = cell.split(',').map((num) => parseInt(num, 10));
        let cellValueDiv = document.querySelector(`.row${rowNum}.col${colNum}>.cellValueDiv`);
        cellValueDiv.style.boxShadow = 'none';
        if (newBorders.length == 0) return;
        let boxShadows = translateToBoxShadows(newBorders);
        prevData.setIndividualEntry('.row' + rowNum + '.col' + colNum, new Map([['borders', prevBorders]]), rowNum, colNum, null);
        newData.setIndividualEntry('.row' + rowNum + '.col' + colNum, new Map([['borders', newBorders]]), rowNum, colNum, null);
        if (boxShadows != '') cellValueDiv.style.boxShadow = boxShadows;
    }
    recordChange(prevData, newData);
    store.dispatch(setBorders({ borders: [...newBorders] }));
}

function translateToBoxShadows(newBorders) {
    let boxShadows = '';
    for (let i = 0; i < newBorders.length; ++i) {
        switch (newBorders[i]) {
            case 'top': boxShadows += 'black 0px 3px 0px -1px inset';
                break;
            case 'right': boxShadows += 'black -3px 0px 0px -1px inset';
                break;
            case 'bottom': boxShadows += 'black 0px -3px 0px -1px inset';
                break;
            case 'left': boxShadows += 'black 3px 0px 0px -1px inset';
                break;
            case 'none': boxShadows = 'none';
            default: break;
        }
        if (i < newBorders.length - 1) boxShadows += ',';
    }
    return boxShadows;
}

export { Borders, updateBorders, translateToBoxShadows };