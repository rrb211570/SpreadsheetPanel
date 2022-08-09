import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { SpreadSheetPanel } from './components'
import reportWebVitals from './reportWebVitals';

const DEFAULT_ROWS = 14;
const DEFAULT_COLS = 12;
const DEFAULT_ROW_HEIGHT = 20;
const DEFAULT_COL_WIDTH = 100;
const STORAGE_URL = null;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(SpreadSheetPanel(DEFAULT_ROWS, DEFAULT_COLS, DEFAULT_ROW_HEIGHT, DEFAULT_COL_WIDTH, STORAGE_URL));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
