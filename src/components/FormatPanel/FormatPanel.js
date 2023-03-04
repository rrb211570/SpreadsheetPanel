import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getSelectionEntries } from './../../store/reducers/selectionSlice.js';
import { batchTurn, testSequence } from '../../tests/sequenceHelpers.js';
import unitTest from './tests/unitTest.js';
import { undo, redo } from './../../data/modifiers/undoRedo.js'

import { FontFamily } from './components/FontFamily/FontFamily.js';
import { FontSize } from './components/FontSize/FontSize.js';
import Bold from './components/Bold/Bold.js';
import Italic from './components/Italic/Italic.js';
import Strikethrough from './components/Strikethrough/Strikethrough.js';
import { FontColor } from './components/FontColor/FontColor.js';

import { CellColor } from './components/CellColor/CellColor.js';
import { Borders } from './components/Borders/Borders.js';
import { HorizontalAlignment } from './components/HorizontalAlignment/HorizontalAlignment.js';
import { VerticalAlignment } from './components/VerticalAlignment/VerticalAlignment.js';

import './FormatPanel.css'

let colors = [
    ['#ffffff', '#000000', '#334155', '#94a3b8', '#cbd5e1'],
    ['#dc2626', '#991b1b', '#ef4444', '#f87171', '#fca5a5'],
    ['#f97316', '#c2410c', '#ea580c', '#fb923c', '#fdba74'],
    ['#fde047', '#a16207', '#ca8a04', '#facc15', '#fef08a'],
    ['#a3e635', '#3f6212', '#65a30d', '#84cc16', '#d9f99d'],
    ['#22c55e', '#15803d', '#16a34a', '#86efac', '#bbf7d0'],
    ['#67e8f9', '#0e7490', '#0891b2', '#22d3ee', '#a5f3fc'],
    ['#3b82f6', '#1e3a8a', '#1d4ed8', '#60a5fa', '#93c5fd'],
    ['#a855f7', '#581c87', '#7e22ce', '#9333ea', '#d8b4fe'],
    ['#d946ef', '#86198f', '#c026d3', '#e879f9', '#f0abfc'],
    ['#ec4899', '#9d174d', '#db2777', '#f472b6', '#f9a8d4'],
];

function FormatPanel() {
    const selectionEntries = useSelector(getSelectionEntries);

    useEffect(() => {
        let timer = setInterval(() => {
            if (batchTurn.current == testSequence.get('FormatPanel').turnNumber) {
                unitTest(testSequence.get('FormatPanel').tests);
                clearInterval(timer);
            }
        }, 500);
    }, []);

    let undoHandler = (e) => {
        undo();
    }

    let redoHandler = (e) => {
        redo();
    }

    let copyHandler = (e) => {
        for (const cell of selectionEntries.values()) {
            let propertyMap = new Map();
            let [rowNum, colNum] = cell.split(',');
            let cellValueDiv = document.querySelector(`.row${rowNum}.col${colNum}>.cellValueDiv`);
            let cellValue = cellValueDiv.querySelector('.cellValue');
            propertyMap.set('value', cellValue.innerText);
            propertyMap.set('fontSize', cellValue.style.fontSize);
            propertyMap.set('fontWeight', cellValue.style.fontWeight);
            propertyMap.set('fontStyle', cellValue.style.fontStyle);
            propertyMap.set('textDecoration', cellValue.style.textDecoration);
            propertyMap.set('color', cellValue.style.color);
            propertyMap.set('cellColor', cellValueDiv.style.backgroundColor);
            propertyMap.set('borders', cellValueDiv.style.borderTop + ' ' + cellValueDiv.style.borderRight + ' ' + cellValueDiv.style.borderBottom + ' ' + cellValueDiv.style.borderLeft);
            propertyMap.set('horizontalAlign', cellValue.style.textAlign);
            propertyMap.set('verticalAlign', cellValueDiv.style.justifyContent);
            //console.log(propertyMap);
        }
    }

    let cutHandler = (e) => {
    }

    let formatPaintHandler = (e) => {
    }

    let pasteHandler = (e) => {
    }

    let darken = (e) => {
        e.target.classList.add('darken');
    }

    let release = (e) => {
        e.target.classList.remove('darken');
    }

    return (
        <div id='formatPanel'>
            <img className='keyboardEventBtn' onClick={undoHandler} onMouseDown={darken} onMouseUp={release} onMouseLeave={release} src='undo.png' alt='undo' />
            <img className='keyboardEventBtn' onClick={redoHandler} onMouseDown={darken} onMouseUp={release} onMouseLeave={release} src='redo.png' alt='redo' />
            <div style={{ height: '26px', width: '26px', borderRadius: '5px' }}>
                <div style={{ position: 'absolute', height: '18px', width: '18px', padding: '4px', borderRadius: '5px', zIndex: 3, backgroundColor: 'rgb(235, 235, 235)', opacity: '0.7' }}>
                </div>
                <img className='keyboardEventBtn' onClick={copyHandler} onMouseDown={darken} onMouseUp={release} onMouseLeave={release} src='copy.png' alt='copy' />
            </div>
            <div style={{ height: '26px', width: '26px', borderRadius: '5px' }}>
                <div style={{ position: 'absolute', height: '18px', width: '18px', padding: '4px', borderRadius: '5px', zIndex: 3, backgroundColor: 'rgb(235, 235, 235)', opacity: '0.7' }}>
                </div>
                <img className='keyboardEventBtn' onClick={cutHandler} onMouseDown={darken} onMouseUp={release} onMouseLeave={release} src='cut.png' alt='cut' />
            </div>
            <div style={{ height: '26px', width: '26px', borderRadius: '5px' }}>
                <div style={{ position: 'absolute', height: '18px', width: '18px', padding: '4px', borderRadius: '5px', zIndex: 3, backgroundColor: 'rgb(235, 235, 235)', opacity: '0.7' }}>
                </div>
                <img className='keyboardEventBtn' onClick={formatPaintHandler} onMouseDown={darken} onMouseUp={release} onMouseLeave={release} src='formatPaint.png' alt='formatPaint' />
            </div>
            <div style={{ height: '26px', width: '26px', borderRadius: '5px' }}>
                <div style={{ position: 'absolute', height: '18px', width: '18px', padding: '4px', borderRadius: '5px', zIndex: 3, backgroundColor: 'rgb(235, 235, 235)', opacity: '0.7' }}>
                </div>
                <img className='keyboardEventBtn' onClick={pasteHandler} onMouseDown={darken} onMouseUp={release} onMouseLeave={release} src='palm.png' alt='paste' />
            </div>
            <p className='formatPanel__divider'></p>
            <FontFamily selectionEntries={selectionEntries} />
            <p className='formatPanel__divider'></p>
            <FontSize selectionEntries={selectionEntries} />
            <p className='formatPanel__divider'></p>
            <Bold selectionEntries={selectionEntries} />
            <Italic selectionEntries={selectionEntries} />
            <Strikethrough selectionEntries={selectionEntries} />
            <FontColor selectionEntries={selectionEntries} colors={colors} />
            <p className='formatPanel__divider'></p>
            <CellColor selectionEntries={selectionEntries} colors={colors} />
            <Borders selectionEntries={selectionEntries} />
            <HorizontalAlignment selectionEntries={selectionEntries} />
            <VerticalAlignment selectionEntries={selectionEntries} />
        </div >
    );
}

export default FormatPanel;