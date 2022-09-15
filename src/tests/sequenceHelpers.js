
// ----------Possible Tests-=------------
// TablePanel: BUILDSHEET, RESIZING, TEXTCHANGE
// SpreadSheetPanel: KEYINPUT
// FormatPanel: TEXTFORMAT, CELLFORMAT
// FunctionPanel: FUNCTIONS
// ChartPanel: BAR, LINE, PIE, DOT
//
let testSequence = new Map([
    ['TablePanel', {
        turnNumber: 1,
        tests: new Set(['BUILD_SHEET'/*, 'SELECTION', 'TEXT_CHANGE', 'RESIZING'*/])
    }],
    ['SpreadSheetPanel', {
        turnNumber: 2,
        tests: new Set([/*'KEY_INPUT'*/])
    }],
    ['App', {
        turnNumber: 3,
        tests: new Set(['END_TO_END'])
    }]
]);

let batchTurn = { current: 1 };

function getInLine(turn) {
    let myTurnNumber = turn.nextAvailable++;
    return myTurnNumber;
}

function nextTurn(turn) {
    turn.current++;
}

function concludeTestingBatch(atomicTurn, batchTurn) {
    let timer = setInterval(() => {
        if (atomicTurn.current == atomicTurn.nextAvailable) { // if all turns have finished
            nextTurn(batchTurn);
            clearInterval(timer);
        }
    }, 100);
}

export { batchTurn, testSequence, getInLine, nextTurn, concludeTestingBatch };