import React, { useState, useEffect } from 'react';
import loadedSheet from '../SpreadSheetPanel/SpreadSheetPanel.js';
import { buildSheet, AxisX, AxisY, table } from './helpers/buildSheet/buildSheet.js'
import { applyResizers } from './handlers/resizingHandler/resizingHandler.js'
import applyCellHandlers from './handlers/cellHandler/cellHandler.js';
import { applyScrollSnapHandlers } from './handlers/scrollSnapHandler/scrollSnapHandler.js';
import { batchTurn, testSequence } from '../../tests/sequenceHelpers.js';
import unitTest from './tests/unitTest.js';
import './TablePanel.css';

function TablePanel(props) {
    let { rows, cols, rowHeight, colWidth } = props;
    let [tableHeight, tableWidth] = buildSheet(loadedSheet, parseInt(rows, 10), parseInt(cols, 10), parseInt(rowHeight, 10), parseInt(colWidth, 10))
    const [sheetAxisX, setSheetAxisX] = useState(AxisX);
    const [sheetAxisY, setSheetAxisY] = useState(AxisY);
    const [sheetTable, setSheetTable] = useState(table);

    useEffect(() => {
        applyResizers(); // resizers.js
        applyCellHandlers();
        applyScrollSnapHandlers();

        let loadTimer = setInterval(() => {
            if (loadedSheet != null) {
                buildSheet(loadedSheet, parseInt(rows, 10), parseInt(cols, 10), parseInt(rowHeight, 10), parseInt(colWidth, 10));
                setSheetAxisX(AxisX);
                setSheetAxisY(AxisY);
                setSheetTable(table);
                clearInterval(loadTimer);
            }
        }, 500);

        let timer = setInterval(() => {
            if (batchTurn.current == testSequence.get('TablePanel').turnNumber) {
                let delay = setTimeout(()=>{
                    unitTest(testSequence.get('TablePanel').tests, loadedSheet, rows, cols, rowHeight, colWidth);
                },2000);
                clearInterval(timer);
            }
        }, 500);
    }, []);

    return (
        <div id='tableDiv' tabIndex='-1'>
            <div id='table' style={{ position: 'absolute', height: '100%', width: '100%' }}>
                <div className='row0 col0 origin' style={{ height: '22px', width: '50px', boxShadow: 'inset -4px -4px 0 1px #ACACAC', zIndex: 4 }}></div>
                {sheetAxisX}
                {sheetAxisY}
                <div id='tableEntryCellsWindow'>
                    <div id='scrollBarLayer' style={{ width: tableWidth - 50 + 'px', height: tableHeight - 22 + 'px' }}></div>
                </div>
                <div id='tableEntryCells' style={{ position: 'relative', height: 'calc(100% - 38px)', width: 'calc(100% - 50px - 18px)', marginLeft: '50px', marginTop: '22px', overflow: 'hidden' }}>
                    {sheetTable}
                </div>
            </div>
        </div>
    );
}

export default React.memo(TablePanel);