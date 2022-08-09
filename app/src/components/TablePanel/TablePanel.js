import React, { useState, useEffect, useRef } from 'react';
import { buildSheet } from './helpers/buildSheet.js'
import { applyResizers } from './handlers/resizingHandler/resizingHandler.js'
import applyTextChangeHandlers from './handlers/textChangeHandler/textChangeHandler.js';
import applySelectionHandler from './handlers/selectionHandler.js';
import { recordChange } from '../../data/modifiers/recordChange.js';
import { featureTurn, testSequence } from '../../tests/interactionTests.js';
import unitTest from './tests/unitTest.js';
import { useDispatch } from 'react-redux'
import { setSelection } from './../../store/reducers/selectionSlice.js'

function TablePanel(props) {
    let { loadedSheet, rows, cols, rowHeight, colWidth, testsToRun } = props;
    const [table, setTable] = useState(buildSheet(loadedSheet, parseInt(rows), parseInt(cols), parseInt(rowHeight), parseInt(colWidth)));

    let keyEventState;
    let selected;
    const dispatch = useDispatch()

    useEffect(() => {
        applyResizers(recordChange); // resizers.js
        applyTextChangeHandlers(recordChange);
        applySelectionHandler(keyEventState, selected, dispatch, setSelection);

        let timer = setInterval(() => {
            if (featureTurn.current == testSequence.get('TablePanel').turnNumber) {
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
export { TablePanel };