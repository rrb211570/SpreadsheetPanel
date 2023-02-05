import React, { useState } from "react";
import { store } from '../../../../store/store.js'
import { useSelector } from 'react-redux';
import { getFontColor, setFontColor } from '../../../../store/reducers/selectionSlice.js';
import Data from "../../../../data/data.js";
import recordChange from "../../../../data/modifiers/recordChange.js";
import './FontColor.css'
import { hexToRgb } from "../../helper.js";

function FontColor({ selectionEntries, colors }) {
    const color = useSelector(getFontColor);
    const [insideDropdown, setInsideDropdown] = useState(false);

    let toggleColorGrid = (e) => {
        let colorGrid = e.target.parentElement.querySelector('.fontColor__colorGrid');
        if (colorGrid.style.opacity == 1) {
            colorGrid.style.opacity = 0;
            colorGrid.style.zIndex = -1;
            colorGrid.style.pointerEvents = 'none';
        } else {
            colorGrid.style.opacity = 1;
            colorGrid.style.zIndex = 3;
            colorGrid.style.pointerEvents = 'auto';
        }
    }

    let createColorGrid = (colors) => {
        let colorGrid = [];
        let index1 = 0;
        for (const colorSet of colors) {
            let colorSetArr = [];
            let index2 = 0;
            for (const colorOption of colorSet) {
                colorSetArr.push(
                    <button key={index2++} className='fontColor__colorSquareBtn' style={{}} onClick={() => updateFontColor(selectionEntries, color, colorOption)}>
                        <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center' }}>
                            <div style={{ width: '15px', height: '15px', backgroundColor: colorOption, border: colorOption == 'white' || index2 == 4 ? '1px solid lightgray' : 'none' }}></div>
                        </div>
                    </button>
                );
            }
            colorGrid.push(<div key={index1++} style={{ display: 'flex', flexDirection: 'column' }}>{colorSetArr}</div>);
        }
        return <div style={{ display: 'flex' }}>{colorGrid}</div>;
    }

    let recordMouseEnter = () => {
        setInsideDropdown(true);
    }

    let recordMouseLeave = () => {
        setInsideDropdown(false);
    }

    let hideColorGrid = (e) => {
        if (!insideDropdown) {
            e.currentTarget.querySelector('.fontColor__colorGrid').style.opacity = 0;
            e.currentTarget.querySelector('.fontColor__colorGrid').style.zIndex = -1;
            e.currentTarget.querySelector('.fontColor__colorGrid').style.pointerEvents = 'none';
        }
    }

    return (
        <div className='fontColor' tabIndex='-1' onMouseEnter={recordMouseEnter} onMouseLeave={recordMouseLeave} onBlur={hideColorGrid} >
            <button className='fontColor__btn' onClick={toggleColorGrid}>
                <div className='fontColor__btnDiv' style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around' }}>
                    <p style={{ height: '19px', margin: '0 0 4px 0', fontSize: '1rem' }}>A</p>
                    <div className='fontColor__colorBar' style={{ position: 'absolute', bottom: '0px', backgroundColor: color, boxShadow: color == 'white' ? 'inset 0 0 0 1px gray' : 'none' }}></div>
                </div>
            </button>
            <div className='fontColor__colorGrid' >
                {createColorGrid(colors)}
            </div>
        </div>
    );
}

let updateFontColor = (selectionEntries, prevColor, newColor) => {
    newColor = hexToRgb(newColor);
    let prevData = new Data();
    let newData = new Data();
    for (const cell of selectionEntries.values()) {
        let [rowNum, colNum] = cell.split(',').map((num) => parseInt(num, 10));
        prevData.setIndividualEntry('.row' + rowNum + '.col' + colNum, new Map([['fontColor', prevColor]]), rowNum, colNum, null);
        newData.setIndividualEntry('.row' + rowNum + '.col' + colNum, new Map([['fontColor', newColor]]), rowNum, colNum, null);
        document.querySelector(`.row${rowNum}.col${colNum}>.cellValueDiv>.cellValue`).style.color = newColor;
    }
    recordChange(prevData, newData);
    store.dispatch(setFontColor({ fontColor: newColor }));
}

export { FontColor, updateFontColor };