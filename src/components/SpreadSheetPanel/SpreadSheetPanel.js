import TestConsolePanel from '../TestConsolePanel/TestConsolePanel.js';
import React from 'react';
import { batchTurn, testSequence } from '../../tests/sequenceHelpers.js';

import unitTest from './tests/unitTest.js';
import appTest from './tests/appTest.js';
import { loadSheetAPI, saveAPI } from './helpers/API.js';
import { keyPressed, keyUpped } from './handlers/keyboardEvents/keyboardEvents.js';

import TablePanel from '../TablePanel/TablePanel.js'
import FormatPanel from '../FormatPanel/FormatPanel.js';

import './SpreadSheetPanel.css'
import CellViewPanel from '../CellViewPanel/CellViewPanel.js';

let loadedSheet = null; // our only global variable

class SpreadSheetPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sheetID: null, // get_URL_parameter(id)
            autoSaveTimer: null,
            title: 'Untitled'
        }
        this.setAutoSaveInterval = this.setAutoSaveInterval.bind(this);
        this.hasSavePayload = this.hasSavePayload.bind(this);
    }

    render() {
        return (
            <div className="content" id="contentID" style={{ height: parseInt(window.innerHeight, 10) - 66 + 'px', width: '100%' }}>
                <TestConsolePanel />
                <div id='spreadsheet' tabIndex='-1' onKeyDown={keyPressed} onKeyUp={keyUpped}>
                    <FormatPanel />
                    <CellViewPanel />
                    <TablePanel rows={this.props.rows} cols={this.props.cols} rowHeight={this.props.rowHeight} colWidth={this.props.colWidth} />
                </div>
            </div>
        );
    }
    componentDidMount() {
        if (this.props.storageURL != null) {
            loadSheetAPI(this.state.sheetID, this.props.storageURL)
                .then(res => {
                    console.log(res);
                    if (res.status == 'success') {
                        let autoSaveInterval = this.setAutoSaveInterval();
                        this.setState({
                            autoSaveInterval: autoSaveInterval,
                        })
                        loadedSheet = res;
                        document.querySelector('#back').removeAttribute('disabled');
                        document.querySelector('#logout').removeAttribute('disabled');
                    } else {
                        if (res.status == 'fail') {
                            if (res.reason == 'missing token') this.props.nav('/');
                            if (res.reason == 'sheetID does not exist') this.props.nav('/sheets')
                        }
                    }
                })
                .catch(err => {
                    console.log('Error: loadSheetAPI(): ' + err);
                    clearInterval(this.state.autoSaveTimer);
                    this.props.nav('/');
                });
        }
        let timer = setInterval(() => {
            if (batchTurn.current == testSequence.get('SpreadSheetPanel').turnNumber) {
                unitTest(testSequence.get('SpreadSheetPanel').tests);
                clearInterval(timer);
            }

        }, 500);
        let timer2 = setInterval(() => {
            if (batchTurn.current == testSequence.get('App').turnNumber) {
                appTest(testSequence.get('App').tests);
                clearInterval(timer2);
            }
        })
    }
    shouldComponentUpdate() {
        return false; // prevent re-renders from changes to Redux
    }
    setAutoSaveInterval() {
        return setInterval(() => {
            console.log('autoSave()');
            if (this.hasSavePayload()) {
                saveAPI(this.state.sheetID, this.props.storageURL)
                    .then(res => {
                        if (res.status == 'success') {
                            console.log(res.dat);
                            this.props.save();
                        }
                        else console.log('autoSave failed');
                    })
                    .catch(err => {
                        console.log('saveError: ' + err);
                        clearInterval(this.state.autoSaveInterval);
                    });
            }
        }, 3000);
    }
    hasSavePayload() {
        return [...this.props.collectedData.getIndividualEntries()].length != 0 ||
            [...this.props.collectedData.getGroupEntries()].length != 0;
    }
}
export default SpreadSheetPanel;