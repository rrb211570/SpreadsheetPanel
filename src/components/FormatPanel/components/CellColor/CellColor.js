import React, { useState } from "react";
import { store } from './../../../../store/store.js'
import { useSelector } from 'react-redux';
import { getCellColor, setCellColor } from '../../../../store/reducers/selectionSlice.js';
import Data from "../../../../data/data.js";
import recordChange from "../../../../data/modifiers/recordChange.js";
import './CellColor.css'
import { hexToRgb } from "../../helper.js";

function CellColor({ selectionEntries, colors }) {
    const color = useSelector(getCellColor);
    const [insideDropdown, setInsideDropdown] = useState(false);

    let toggleColorGrid = (e) => {
        let colorGrid = e.target.parentElement.querySelector('.cellColor__colorGrid');
        if (colorGrid.style.opacity == 1) {
            colorGrid.style.opacity = 0;
            colorGrid.style.zIndex = -1;
            colorGrid.style.pointerEvents = 'none';
        } else {
            colorGrid.style.opacity = 1;
            colorGrid.style.zIndex = 1;
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
                    <button key={index2++} className='cellColor__colorSquareBtn' style={{}} onClick={() => updateCellColor(selectionEntries, color, colorOption)}>
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
            e.currentTarget.querySelector('.cellColor__colorGrid').style.opacity = 0;
            e.currentTarget.querySelector('.cellColor__colorGrid').style.zIndex = -1;
            e.currentTarget.querySelector('.cellColor__colorGrid').style.pointerEvents = 'none';
        }
    }

    return (
        <div className='cellColor' tabIndex='-1' onMouseEnter={recordMouseEnter} onMouseLeave={recordMouseLeave} onBlur={hideColorGrid} >
            <button className='cellColor__btn' onClick={toggleColorGrid}>
                <div className='cellColor__btnDiv' style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around' }}>
                    <div style={{ position: 'relative', width: '100%', height: '19px' }}>
                        <img src='bucket.png' alt='bucket' style={{ position: 'absolute', width: '16px', height: '16px', left: 0, right: 0, marginBottom: '3px' }} />
                    </div>
                    <div className='cellColor__colorBar' style={{ position: 'absolute', bottom: '0px', backgroundColor: color, boxShadow: color == 'white' ? 'inset 0 0 0 1px gray' : 'none' }}></div>
                </div>
            </button>
            <div className='cellColor__colorGrid' >
                {createColorGrid(colors)}
            </div>
        </div>
    );
}

let updateCellColor = (selectionEntries, prevColor, newColor) => {
    newColor = hexToRgb(newColor);
    let prevData = new Data();
    let newData = new Data();
    for (const cell of selectionEntries.values()) {
        let [rowNum, colNum] = cell.split(',').map((num) => parseInt(num, 10));
        prevData.setIndividualEntry('.row' + rowNum + '.col' + colNum, new Map([['cellColor', prevColor]]), rowNum, colNum, null);
        newData.setIndividualEntry('.row' + rowNum + '.col' + colNum, new Map([['cellColor', newColor]]), rowNum, colNum, null);
        document.querySelector(`.row${rowNum}.col${colNum}>.cellValueDiv`).style.backgroundColor = newColor;
    }
    recordChange(prevData, newData);
    store.dispatch(setCellColor({ cellColor: newColor }));
}

export { CellColor, updateCellColor };