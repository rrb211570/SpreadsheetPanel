import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BodyPanel } from './components'
import reportWebVitals from './reportWebVitals';
import { updateScrollDimensions } from './components/TablePanel/handlers/scrollSnapHandler/scrollSnapHandler';

const DEFAULT_ROWS = 100;
const DEFAULT_COLS = 26;
const DEFAULT_ROW_HEIGHT = 22;
const DEFAULT_COL_WIDTH = 100;
const STORAGE_URL = null;

window.onresize = () => {
    updateScrollDimensions();
    // update scrollbarLayerDimensions and d
    // document.querySelector('#scrollBarLayer').style.height = store.getState().tableDimensions.height - 22 + 'px';
    // document.querySelector('#scrollBarLayer').style.width = store.getState().tableDimensions.width - 50 + 'px';
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(BodyPanel(DEFAULT_ROWS, DEFAULT_COLS, DEFAULT_ROW_HEIGHT, DEFAULT_COL_WIDTH, STORAGE_URL));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
