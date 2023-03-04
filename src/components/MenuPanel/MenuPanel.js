import React, { useState, useEffect } from 'react';
import { batchTurn, testSequence } from '../../tests/sequenceHelpers.js';
import unitTest from './tests/unitTest.js';
import './MenuPanel.css'

const FILE = 'File';
const EDIT = 'Edit';
const VIEW = 'View';
const FORMAT = 'Format';
const HELP = 'Help';

function MenuPanel() {
    const [options, setOptions] = useState(<div></div>);
    const [marginLeftMap, setMarginLeftMap] = useState();

    useEffect(() => {
        let delta = 0;
        let deltaMap = new Map();
        let menuButtons = document.querySelectorAll('.menuPanel__button');
        for (const menuButton of menuButtons.values()) {
            deltaMap.set(menuButton.innerText, delta);
            delta += parseInt(menuButton.offsetWidth, 10);
        };
        setMarginLeftMap(deltaMap);

        let timer = setInterval(() => {
            if (batchTurn.current == testSequence.get('MenuPanel').turnNumber) {
                unitTest(testSequence.get('MenuPanel').tests);
                clearInterval(timer);
            }
        }, 500);
    }, []);

    let highlightItem = (e) => {
        e.target.style.backgroundColor = 'rgb(235, 235, 235)';
    }

    let removeHighlightItem = (e) => {
        e.target.style.backgroundColor = 'white';
    }

    let revealDropdown = (arg) => {
        switch (arg) {
            case FILE:
                setOptions([
                    <div key='0' className='menuPanel__dropdownOption' onMouseEnter={highlightItem} onMouseLeave={removeHighlightItem}>Import</div>,
                    <div key='1' className='menuPanel__dropdownOption' onMouseEnter={highlightItem} onMouseLeave={removeHighlightItem}>Make a copy</div>,
                    <div key='2' className='menuPanel__dropdownOption' onMouseEnter={highlightItem} onMouseLeave={removeHighlightItem}>Download</div>,
                    <div key='3' className='menuPanel__dropdownOption' onMouseEnter={highlightItem} onMouseLeave={removeHighlightItem}>Print</div>,
                    <div key='4' className='menuPanel__dropdownOption' onMouseEnter={highlightItem} onMouseLeave={removeHighlightItem}>Move to trash</div>,
                ]);
                break;
            case EDIT:
                setOptions([
                    <div key='0' className='menuPanel__dropdownOption' onMouseEnter={highlightItem} onMouseLeave={removeHighlightItem}>Undo</div>,
                    <div key='1' className='menuPanel__dropdownOption' onMouseEnter={highlightItem} onMouseLeave={removeHighlightItem}>Redo</div>,
                    <div key='2' className='menuPanel__dropdownOption' onMouseEnter={highlightItem} onMouseLeave={removeHighlightItem}>Cut</div>,
                    <div key='3' className='menuPanel__dropdownOption' onMouseEnter={highlightItem} onMouseLeave={removeHighlightItem}>Copy</div>,
                    <div key='4' className='menuPanel__dropdownOption' onMouseEnter={highlightItem} onMouseLeave={removeHighlightItem}>Paste</div>,
                    <div key='5' className='menuPanel__dropdownOption' onMouseEnter={highlightItem} onMouseLeave={removeHighlightItem}>Delete</div>
                ]);
                break;
            case VIEW:
                setOptions([
                    <div key='1' className='menuPanel__dropdownOption' onMouseEnter={highlightItem} onMouseLeave={removeHighlightItem}>Zoom</div>,
                    <div key='2' className='menuPanel__dropdownOption' onMouseEnter={highlightItem} onMouseLeave={removeHighlightItem}>Fullscreen</div>,
                ]);
                break;
            case FORMAT:
                setOptions([
                    <div key='0' className='menuPanel__dropdownOption' onMouseEnter={highlightItem} onMouseLeave={removeHighlightItem}>Font Family</div>,
                    <div key='1' className='menuPanel__dropdownOption' onMouseEnter={highlightItem} onMouseLeave={removeHighlightItem}>Font Size</div>,
                    <div key='2' className='menuPanel__dropdownOption' onMouseEnter={highlightItem} onMouseLeave={removeHighlightItem}>Text</div>,
                    <div key='3' className='menuPanel__dropdownOption' onMouseEnter={highlightItem} onMouseLeave={removeHighlightItem}>Font Color</div>,
                    <div key='4' className='menuPanel__dropdownOption' onMouseEnter={highlightItem} onMouseLeave={removeHighlightItem}>Cell Color</div>,
                    <div key='5' className='menuPanel__dropdownOption' onMouseEnter={highlightItem} onMouseLeave={removeHighlightItem}>Alignment</div>,
                    <div key='6' className='menuPanel__dropdownOption' onMouseEnter={highlightItem} onMouseLeave={removeHighlightItem}>Clear formatting</div>,
                ]);
                break;
            case HELP:
                setOptions([
                    <div key='0' className='menuPanel__dropdownOption' onMouseEnter={highlightItem} onMouseLeave={removeHighlightItem}>Help</div>,
                    <div key='1' className='menuPanel__dropdownOption' onMouseEnter={highlightItem} onMouseLeave={removeHighlightItem}>Report bug</div>,
                    <div key='2' className='menuPanel__dropdownOption' onMouseEnter={highlightItem} onMouseLeave={removeHighlightItem}>Privacy Policy</div>,
                    <div key='3' className='menuPanel__dropdownOption' onMouseEnter={highlightItem} onMouseLeave={removeHighlightItem}>Terms of Service</div>,
                    <div key='4' className='menuPanel__dropdownOption' onMouseEnter={highlightItem} onMouseLeave={removeHighlightItem}>Keyboard Shortcuts</div>,
                ]);
                break;
            default: break;
        }
        document.querySelector('#menuPanel__dropdown').style.opacity = 1;
        document.querySelector('#menuPanel__dropdown').style.zIndex = 3;
        document.querySelector('#menuPanel__dropdown').style.height = 'auto';
        document.querySelector('#menuPanel__dropdown').style.left = marginLeftMap.get(arg) + 'px';
        document.querySelector('#menuPanel__dropdown').focus();
    }

    let hideDropdown = (e) => {
        document.querySelector('#menuPanel__dropdown').style.opacity = 0;
        document.querySelector('#menuPanel__dropdown').style.zIndex = -1;
        document.querySelector('#menuPanel__dropdown').style.height = '0px';
    }

    return (
        <div id='menuPanel'>
            <div id='menuPanel__file' className='menuPanel__button' onMouseEnter={highlightItem} onMouseLeave={removeHighlightItem} onClick={() => revealDropdown(FILE)}>File</div>
            <div id='menuPanel__edit' className='menuPanel__button' onMouseEnter={highlightItem} onMouseLeave={removeHighlightItem} onClick={() => revealDropdown(EDIT)}>Edit</div>
            <div id='menuPanel__view' className='menuPanel__button' onMouseEnter={highlightItem} onMouseLeave={removeHighlightItem} onClick={() => revealDropdown(VIEW)}>View</div>
            <div id='menuPanel__format' className='menuPanel__button' onMouseEnter={highlightItem} onMouseLeave={removeHighlightItem} onClick={() => revealDropdown(FORMAT)}>Format</div>
            <div id='menuPanel__help' className='menuPanel__button' onMouseEnter={highlightItem} onMouseLeave={removeHighlightItem} onClick={() => revealDropdown(HELP)}>Help</div>
            <div tabIndex={-1} id='menuPanel__dropdown' onBlur={hideDropdown}>{options}</div>
        </div>
    );
}
export default React.memo(MenuPanel);