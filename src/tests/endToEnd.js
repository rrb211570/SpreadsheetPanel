import { checkReactionOfResizing } from "../components/TablePanel/handlers/resizingHandler/resizingTest.js";
import { checkReactionOfTextChange } from "../components/TablePanel/handlers/cellHandler/textChangeHandler/textChangeTest.js";
import { validateSequence, checkReactionOfKeyInput } from "../components/SpreadSheetPanel/handlers/keyboardEvents/keyboardTest.js";
import { checkReactionOfSingleClickSelection, checkReactionOfDoubleClickSelection } from "../components/TablePanel/handlers/cellHandler/selectionHandler/selectionTest.js";
import { UNDO_DISPATCH, UNDO_FINISH, REDO_DISPATCH, REDO_FINISH, FLUFF_FULL } from './../components/SpreadSheetPanel/handlers/keyboardEvents/keyMacros.js'

const X_AXIS = 'X_AXIS';
const Y_AXIS = 'Y_AXIS';

function endToEnd(atomicTurn) {

    // sequence of atomic tests
    let axisCellsX = document.querySelectorAll('.AxisX');
    let axisCellsY = document.querySelectorAll('.AxisY');
    let resizeEvents = [[Y_AXIS, [1, 2, 3], 20], [Y_AXIS, [2, 5, 6], 10], [Y_AXIS, [1, 2, 3], -10], [X_AXIS, [2, 5, 6], -20]];
    let keyEvents = [UNDO_DISPATCH, UNDO_FINISH, UNDO_DISPATCH, UNDO_FINISH, REDO_DISPATCH, REDO_FINISH, REDO_DISPATCH, REDO_FINISH, REDO_DISPATCH, REDO_FINISH, FLUFF_FULL];
    let clickSelections = [[4, 5], [1, 1], [3, 7], [8, 2], [2, 4]];
    let textEntries = ['blah', 'burger', 'hello', 'world', 'apple', 'fun'];

    let totalKeyInputTestCases = validateSequence(keyEvents);
    if (totalKeyInputTestCases == -1) return;
    let keyInputTestCaseIndex = 1;
    try {
        /*for (let i = 0; i < clickSelections.length; ++i) {
            if (i == 0) checkReactionOfSingleClickSelection(clickSelections[i][0], clickSelections[i][1], atomicTurn, true);
            else checkReactionOfSingleClickSelection(clickSelections[i][0], clickSelections[i][1], atomicTurn);
        }*/
        for (let i = 0; i < clickSelections.length; ++i) {
            if (i == 0) checkReactionOfDoubleClickSelection(i + 1, clickSelections[i], atomicTurn, true, clickSelections.length);
            else checkReactionOfDoubleClickSelection(i + 1, clickSelections[i], atomicTurn, false, clickSelections.length);
            if (i < textEntries.length) checkReactionOfTextChange(i + 1, [...clickSelections[i], textEntries[i]], atomicTurn, false, clickSelections.length)
        }
        let keyState = new Set();
        for (let i = 0; i < keyEvents.length; ++i) {
            for (let j = 0; j < keyEvents[i].length; ++j) {
                if (i == 0 && j == 0) checkReactionOfKeyInput(keyInputTestCaseIndex, keyEvents[i][j], keyState, atomicTurn, true, totalKeyInputTestCases);
                else checkReactionOfKeyInput(++keyInputTestCaseIndex, keyEvents[i][j], keyState, atomicTurn, false, totalKeyInputTestCases);
            }
        }
        for (let i = 0; i < resizeEvents.length; ++i) {
            let chosenCells = [];
            if (resizeEvents[i][0] == X_AXIS) resizeEvents[i][1].map(cellNum => chosenCells.push(axisCellsX[cellNum]))
            else if (resizeEvents[i][0] == Y_AXIS) resizeEvents[i][1].map(cellNum => chosenCells.push(axisCellsY[cellNum]))
            if (i == 0) checkReactionOfResizing(i + 1, [chosenCells, resizeEvents[i][2]], atomicTurn, true, resizeEvents.length);
            else checkReactionOfResizing(i + 1, [chosenCells, resizeEvents[i][2]], atomicTurn, false, resizeEvents.length);
        }
        keyInputTestCaseIndex = 1;
        keyState = new Set();
        for (let i = 0; i < keyEvents.length; ++i) {
            for (let j = 0; j < keyEvents[i].length; ++j) {
                if (i == 0 && j == 0) checkReactionOfKeyInput(keyInputTestCaseIndex, keyEvents[i][j], keyState, atomicTurn, true, totalKeyInputTestCases);
                else checkReactionOfKeyInput(++keyInputTestCaseIndex, keyEvents[i][j], keyState, atomicTurn, false, totalKeyInputTestCases);
            }
        }
        let timer = setInterval(() => {
            if (atomicTurn.current == atomicTurn.nextAvailable) {
                let testNum = document.querySelector('#testConsoleStatus').innerHTML.match(/(\d+)/)[0];
                document.querySelector('#testConsoleStatus').innerHTML = parseInt(testNum, 10) + 1 + ' SUCCESS';
                clearInterval(timer);
            }
        }, 500)
    } catch (e) {
        console.log('Error: ' + e);
    }
}

export default endToEnd;