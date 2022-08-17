import { checkReactionOfResizingOnTable } from "../components/TablePanel/handlers/resizingHandler/test";
import { checkReactionOfTextChange } from "../components/TablePanel/handlers/textChangeHandler/test";
import { checkReactionOfKeyInput } from "../components/SpreadSheetPanel/handlers/keyboardEvents/test";
import { getInLine, nextTurn } from './sequenceHelpers.js'

function endToEnd() {
    let turn = {
        current: 1,
        nextAvailable: 1
    };

    // sequence of atomic tests
    let axisCellsX = document.querySelectorAll('.AxisX');
    let axisCellsY = document.querySelectorAll('.AxisY');
    let events = [UNDO_DISPATCH, UNDO_FINISH, UNDO_DISPATCH, UNDO_FINISH, REDO_DISPATCH, REDO_FINISH, REDO_DISPATCH, REDO_FINISH, REDO_DISPATCH, REDO_FINISH, FLUFF_FULL];
    if (validateSequence(events) == -1) return;
    try {
        let keyState = new Set();
        for (let i = 0; i < events.length; ++i) {
            for (let j = 0; j < events[i].length; ++j) {
                if (i == 0 && j == 0) checkReactionOfKeyInput(events[i][j], keyState, turn, true);
                else checkReactionOfKeyInput(events[i][j], keyState, turn);
            }
        }
        concludeTest(turn);
    } catch (e) {
        console.log('Error: ' + e);
    }
}