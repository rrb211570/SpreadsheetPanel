import React from 'react';
import { Provider, connect } from 'react-redux'
import { batchTurn, sequenceTests, testSequence } from '../../tests/sequenceHelpers.js';

import unitTest from './tests/unitTest.js';
import appTest from './tests/appTest.js';
import { loadSheetAPI, saveAPI } from './helpers/API.js';
import { keyPressed, keyUpped } from './handlers/keyboardEvents/keyboardEvents.js';
import TablePanel from '../TablePanel/TablePanel.js'
import FormatPanel from '../FormatPanel/FormatPanel.js'
import { store, mapStateToProps, mapDispatchToProps } from './../../store/store.js'
import { setSheetDimensions } from './../../store/reducers/sheetDimensionsSlice.js'

class MainPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sheetID: null, // get_URL_parameter(id)
            loadedSheet: null,
            autoSaveTimer: null,
        }
        this.setAutoSaveInterval = this.setAutoSaveInterval.bind(this);
        this.hasSavePayload = this.hasSavePayload.bind(this);
    }
    render() {
        return (
            <div className="content" id="contentID" style={{ height: window.innerHeight * .95, width: '100%' }}>
                {/*<FormatPanel />*/}
                <div id='spreadsheet' tabIndex='-1' onKeyDown={keyPressed} onKeyUp={keyUpped}>
                    <TablePanel loadedSheet={this.state.loadedSheet} rows={this.props.rows} cols={this.props.cols} rowHeight={this.props.rowHeight} colWidth={this.props.colWidth} />
                </div>
            </div>
        );
    }
    componentDidMount() {
        console.log(this.props);
        if (this.props.storageURL != null) {
            loadSheetAPI(this.state.sheetID, this.props.storageURL)
                .then(res => {
                    console.log(res);
                    if (res.status == 'success') {
                        let autoSaveInterval = this.setAutoSaveInterval();
                        this.setState({
                            loadedSheet: res,
                            autoSaveInterval: autoSaveInterval,
                        })
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
    shouldComponentUpdate() { // prevent unnecessary re-renders on changes to Redux store
        return false;
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

// ----------Possible Tests-=------------
// TablePanel: BUILDSHEET, RESIZING, TEXTCHANGE
// SpreadSheetPanel: KEYINPUT
// FormatPanel: TEXTFORMAT, CELLFORMAT
// FunctionPanel: FUNCTIONS
// ChartPanel: BAR, LINE, PIE, DOT
//
let whichTests = new Map([
    ['TablePanel', new Set([/*'SELECTION', 'TEXTCHANGE', 'RESIZING'*/])],
    ['SpreadSheetPanel', new Set([/*'KEYINPUT'*/])],
    ['App', new Set(['ENDTOEND'])]
]);
sequenceTests(whichTests);
const MainContainer = connect(mapStateToProps, mapDispatchToProps)(MainPanel);
function SpreadSheetPanel(defaultRows, defaultCols, defaultRowHeight, defaultColWidth, storageURL) {

    const tableHeight = (defaultRows + 1) * defaultRowHeight;
    const tableWidth = (defaultCols * defaultColWidth) + (defaultColWidth / 2);
    store.dispatch(setSheetDimensions({ tableHeight, tableWidth }));

    return (
        <div>
            <Provider store={store}>
                <MainContainer rows={defaultRows} cols={defaultCols} rowHeight={defaultRowHeight} colWidth={defaultColWidth} storageURL={storageURL} />
            </Provider>
        </div>
    )
}
export default SpreadSheetPanel;