import React, { useState, useEffect, useRef } from 'react';
import { buildSheet } from './helpers/buildSheet/buildSheet.js'
import { applyResizers } from './handlers/resizingHandler/resizingHandler.js'
import applyCellHandlers from './handlers/cellHandler/cellHandler.js';
import { batchTurn, testSequence } from '../../tests/sequenceHelpers.js';
import unitTest from './tests/unitTest.js';


function TablePanel(props) {
    let { loadedSheet, rows, cols, rowHeight, colWidth } = props;
    const [table, setTable] = useState(buildSheet(loadedSheet, parseInt(rows, 10), parseInt(cols, 10), parseInt(rowHeight, 10), parseInt(colWidth, 10)));

    useEffect(() => {
        applyResizers(); // resizers.js
        applyCellHandlers();

        let timer = setInterval(() => {
            if (batchTurn.current == testSequence.get('TablePanel').turnNumber) {
                unitTest(testSequence.get('TablePanel').tests);
                clearInterval(timer);
            }
        }, 500);
    }, []);

    return (
        <div>
            {table}
        </div>
    );
}
export default TablePanel;