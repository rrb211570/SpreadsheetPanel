
// ----------Possible Tests-=------------
// TablePanel: BUILD_SHEET, SELECTION, TEXT_CHANGE, RESIZING
// SpreadSheetPanel: KEY_INPUT
// MenuPanel: MENU_INTERACTION
// FormatPanel: BOLD, ITALIC, STRIKETHROUGH, FONT_FAMILY
// (not implemented) FunctionPanel: FUNCTIONS
// (not implemented) ChartPanel: BAR, LINE, PIE, DOT
//
let testSequence = new Map([
    ['TablePanel', {
        turnNumber: 1,
        tests: new Set(['BUILD_SHEET', 'SELECTION', 'TEXT_CHANGE', 'RESIZING'])
    }],
    ['SpreadSheetPanel', {
        turnNumber: 5,
        tests: new Set([/*'KEY_INPUT'*/])
    }],
    ['MenuPanel', {
        turnNumber: 3,
        tests: new Set([/*'MENU_INTERACTION'*/])
    }],
    ['FormatPanel', {
        turnNumber: 2,
        tests: new Set(['BOLD', 'ITALIC', 'STRIKETHROUGH', 'FONT_FAMILY', 'FONT_SIZE', 'FONT_COLOR','CELL_COLOR','BORDERS','HORIZONTAL_ALIGNMENT', 'VERTICAL_ALIGNMENT'])
    }],
    ['App', {
        turnNumber: 4,
        tests: new Set([/*'END_TO_END'*/])
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