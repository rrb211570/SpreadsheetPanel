
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
        tests: new Set([/*'BUILD_SHEET', 'SELECTION', 'TEXT_CHANGE', 'RESIZING'*/])
    }],
    ['FormatPanel', {
        turnNumber: 2,
        tests: new Set([/*'FONT_SIZE', 'FONT_FAMILY', 'BOLD', 'ITALIC', 'STRIKETHROUGH', 'FONT_COLOR', 'CELL_COLOR', 'BORDERS', 'HORIZONTAL_ALIGNMENT', 'VERTICAL_ALIGNMENT'*/])
    }],
    ['SpreadSheetPanel', {
        turnNumber: 3,
        tests: new Set([/*'KEY_INPUT'*/])
    }],
    ['App', {
        turnNumber: 4,
        tests: new Set([/*'END_TO_END'*/])
    }],
    ['MenuPanel', {
        turnNumber: 5,
        tests: new Set([/*'MENU_INTERACTION'*/])
    }],
]);

let batchTurn = { current: 1 };

function getInLine(turn) {
    let myTurnNumber = turn.nextAvailable++;
    return myTurnNumber;
}

function nextTurn(turn) {
    turn.current++;
}

function concludeTestingBatch(atomicTurn) {
    let timer = setInterval(() => {
        if (atomicTurn.current == atomicTurn.nextAvailable) { // if all turns have finished
            nextTurn(batchTurn);
            clearInterval(timer);
        }
    }, 100);
}

function concludeAllTestsWhenDone() {
    let timer = setInterval(() => {
        if (batchTurn.current == 6) {
            let testNum = document.querySelector('#testConsoleStatus').innerHTML.match(/(\d+)/)[0];
            document.querySelector('#testConsoleStatus').innerHTML = parseInt(testNum, 10) + 1 + ' SUCCESS';
            clearInterval(timer);
        }
    }, 100);
}

export { batchTurn, testSequence, getInLine, nextTurn, concludeTestingBatch, concludeAllTestsWhenDone };