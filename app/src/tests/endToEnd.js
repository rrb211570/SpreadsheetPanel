import { checkReactionOfResizingOnTable } from "../components/TablePanel/handlers/resizingHandler/test";
import { checkReactionOfTextChange } from "../components/TablePanel/handlers/cellHandler/textChangeHandler/test";
import { validateSequence, checkReactionOfKeyInput } from "../components/SpreadSheetPanel/handlers/keyboardEvents/test";
import { concludeTestingBatch } from './sequenceHelpers.js'
import { checkReactionOfSingleClickSelection, checkReactionOfDoubleClickSelection } from "../components/TablePanel/handlers/cellHandler/selectionHandler/test";
import { UNDO_DISPATCH, UNDO_FINISH, REDO_DISPATCH, REDO_FINISH, FLUFF_FULL } from './../components/SpreadSheetPanel/handlers/keyboardEvents/keyMacros.js'

function endToEnd(atomicTurn) {

    // sequence of atomic tests
    let axisCellsX = document.querySelectorAll('.AxisX');
    let axisCellsY = document.querySelectorAll('.AxisY');
    let keyEvents = [UNDO_DISPATCH, UNDO_FINISH, UNDO_DISPATCH, UNDO_FINISH, REDO_DISPATCH, REDO_FINISH, REDO_DISPATCH, REDO_FINISH, REDO_DISPATCH, REDO_FINISH, FLUFF_FULL];
    let clickSelections = [[4, 5], [1, 1], [3, 7], [8, 2], [2, 4]];
    let textEntries = ['blah', 'burger', 'hello', 'world', 'apple', 'fun'];
    if (validateSequence(keyEvents) == -1) return;
    try {
        /*for (let i = 0; i < clickSelections.length; ++i) {
            if (i == 0) checkReactionOfSingleClickSelection(clickSelections[i][0], clickSelections[i][1], atomicTurn, true);
            else checkReactionOfSingleClickSelection(clickSelections[i][0], clickSelections[i][1], atomicTurn);
            
        }*/
        for (let i = 0; i < clickSelections.length; ++i) {
            if (i == 0) checkReactionOfDoubleClickSelection(clickSelections[i][0], clickSelections[i][1], atomicTurn, true);
            else checkReactionOfDoubleClickSelection(clickSelections[i][0], clickSelections[i][1], atomicTurn);
            if (i < textEntries.length) checkReactionOfTextChange(clickSelections[i][0], clickSelections[i][1], textEntries[i], atomicTurn)
        }
        let keyState = new Set();
        for (let i = 0; i < keyEvents.length; ++i) {
            for (let j = 0; j < keyEvents[i].length; ++j) {
                if (i == 0 && j == 0) checkReactionOfKeyInput(keyEvents[i][j], keyState, atomicTurn, true);
                else checkReactionOfKeyInput(keyEvents[i][j], keyState, atomicTurn);
            }
        }
    } catch (e) {
        console.log('Error: ' + e);
    }
}

export default endToEnd;