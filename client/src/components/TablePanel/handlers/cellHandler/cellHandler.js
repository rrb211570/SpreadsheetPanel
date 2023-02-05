import applyTextChangeHandler from './textChangeHandler/textChangeHandler.js';
import { applySelectionHandler } from './selectionHandler/selectionHandler.js'

function applyCellHandlers() {
    const entryCells = [...document.querySelectorAll('.entryCell')];
    entryCells.forEach(entryCell => {
        applySelectionHandler(entryCell);
        applyTextChangeHandler(entryCell);
    });
}

export default applyCellHandlers;