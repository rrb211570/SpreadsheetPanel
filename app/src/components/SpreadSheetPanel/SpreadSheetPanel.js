import React from 'react';
import { Provider, connect, useSelector } from 'react-redux'
import { featureTurn, sequenceTests, testSequence } from '../../tests/interactionTests.js';
import unitTest from './tests/unitTest.js';
import { keyInputTest} from './handlers/keyboardEvents/test.js'
import { loadSheetAPI, saveAPI } from './helpers/API.js';
import { keyPressed, keyUpped } from './handlers/keyboardEvents/keyboardEvents.js';
import { TablePanel } from '../TablePanel/TablePanel.js'
import FormatPanel from '../FormatPanel/FormatPanel.js'
import { store, mapStateToProps, mapDispatchToProps } from './../../store/store.js'
import { setSheetDimensions, getTableHeight, getTableWidth } from './../../store/reducers/sheetDimensionsSlice.js'
import { undo, redo } from './../../data/modifiers/undoRedo.js'

let NOCOMMAND = 'NoCommand';
class NetworkPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sheetID: null, // get_URL_parameter(id)
            loadedSheet: null,
            autoSaveTimer: null,
            keyEventState: 'NoCommand',
            testingKeyInput: this.props.whichTests.get('SpreadSheetPanel').has('KEYINPUT'),
            keyOutcome: null,
            timeTravelCounter: 0
        }
        this.setAutoSaveInterval = this.setAutoSaveInterval.bind(this);
        this.hasSavePayload = this.hasSavePayload.bind(this);

        // imported
        this.loadSheetAPI = loadSheetAPI.bind(this);
        this.saveAPI = saveAPI.bind(this);
        this.keyPressed = keyPressed.bind(this);
        this.keyUpped = keyUpped.bind(this);
        this.unitTest = unitTest.bind(this);
        this.keyInputTest = keyInputTest.bind(this);
        this.undo = undo.bind(this);
        this.redo = redo.bind(this);
    }
    render() {
        return (
            <div className="content" id="contentID" style={{ height: window.innerHeight * .95, width: '100%' }}>
                {/*<FormatPanel />*/}
                <div id='spreadsheet' tabIndex='-1' onKeyDown={this.keyPressed} onKeyUp={this.keyUpped}>
                    <TablePanel loadedSheet={this.state.loadedSheet} rows={this.props.rows} cols={this.props.cols} rowHeight={this.props.rowHeight} colWidth={this.props.colWidth} testsToRun={this.props.whichTests.get('TablePanel')} />
                </div>
            </div>
        );
    }
    componentDidMount() {
        console.log(this.state.testingKeyInput);
        console.log(this.props);
        if (this.props.storageURL != null) {
            this.loadSheetAPI(this.state.sheetID, this.props.storageURL)
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
        let timer = setInterval(()=>{
            if(featureTurn.current==testSequence.get('SpreadSheetPanel').turnNumber){
                this.unitTest(testSequence.get('SpreadSheetPanel').tests);
                clearInterval(timer);
            }
        },500);
        
    }
    shouldComponentUpdate() { // prevent unnecessary re-renders on changes to Redux store
        return false;
    }
    setAutoSaveInterval() {
        return setInterval(() => {
            console.log('autoSave()');
            if (this.hasSavePayload()) {
                this.saveAPI(this.state.sheetID, this.props.storageURL)
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
// FormatPanel: TEXTFORMAT, CELLFORMAT
// FunctionPanel: FUNCTIONS
// ChartPanel: BAR, LINE, PIE, DOT
//
let whichTests = new Map([
    ['TablePanel', new Set(['RESIZING','TEXTCHANGE'])],
    ['SpreadSheetPanel', new Set(['KEYINPUT'])]
]);
sequenceTests(whichTests);
const NetworkContainer = connect(mapStateToProps, mapDispatchToProps)(NetworkPanel);
function SpreadSheetPanel(defaultRows, defaultCols, defaultRowHeight, defaultColWidth, storageURL) {

    const tableHeight = (defaultRows + 1) * defaultRowHeight;
    const tableWidth = (defaultCols * defaultColWidth) + (defaultColWidth / 2);
    store.dispatch(setSheetDimensions({ tableHeight, tableWidth }));

    return (
        <div>
            <Provider store={store}>
                <NetworkContainer rows={defaultRows} cols={defaultCols} rowHeight={defaultRowHeight} colWidth={defaultColWidth} storageURL={storageURL} whichTests={whichTests} />
            </Provider>
        </div>
    )
}
export default SpreadSheetPanel;