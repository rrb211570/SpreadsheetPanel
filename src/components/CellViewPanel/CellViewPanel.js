import React, { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { getSelectionEntries } from '../../store/reducers/selectionSlice.js';
import './CellViewPanel.css'

function CellViewPanel() {
    const selectionEntries = useSelector(getSelectionEntries);

    return (
        <div id='cellViewPanel'>
            <div style={{ width: '70px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p id='cellViewPanel__cellAddress'>{getAddress(selectionEntries)}</p>
                <p id='cellViewPanel__divider'></p>
            </div>
            <p id='cellViewPanel__cellTextValue'></p>
        </div>
    );
}

function getAddress(selectedEntries) {
    let cell = selectedEntries.values().next().value;
    let [rowNum, colNum] = cell.split(',');
    let letter = String.fromCharCode(parseInt(colNum, 10) % 26 + 64);
    return letter + rowNum;
}

export default CellViewPanel;