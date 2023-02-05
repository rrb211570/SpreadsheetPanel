import { store } from './../../../../store/store.js'
import { trackEvent } from "../../../../store/reducers/keyboardEventsSlice.js";
import { undo, redo } from './../../../../data/modifiers/undoRedo.js'

const NO_COMMAND = 'No Command';
const CONTROL = 'Control';
const META = 'Meta'
const SHIFT = 'Shift';
const CONTROL_SHIFT = 'Control_Shift';
const NO_CHANGE = 'No Change';

// Handle CTRL+Z/Y (undo/redo) and CTRL/SHIFT selections.
function keyPressed(e) {
    console.log(e.key.padStart(7, ' ') + ' DOWN');
    let deleteThisVariable;
    switch (store.getState().keyboardEvents.inputMode) {
        case NO_COMMAND:
            if (e.key === CONTROL || e.key === META) {
                store.dispatch(trackEvent({ inputMode: CONTROL, outcome: NO_CHANGE }))
            } else if (e.key === SHIFT) {
                store.dispatch(trackEvent({ inputMode: SHIFT, outcome: NO_CHANGE }))
            }
            break;
        case CONTROL:
            if (e.key === 'z') undo();
            else if (e.key === 'y') redo();
            else if (e.key === 'x') deleteThisVariable = 0;
            else if (e.key === 'c') deleteThisVariable = 0;
            else if (e.key === 'v') deleteThisVariable = 0;
            break;
        case SHIFT:
            break;
        case CONTROL_SHIFT:
            if (e.key === 'f') deleteThisVariable = 0; //formatPaint
            break;
        default: break;
    }
}
function keyUpped(e) {
    console.log(e.key.padStart(7, ' ') + ' UP');
    switch (store.getState().keyboardEvents.inputMode) {
        case NO_COMMAND:
            store.dispatch(trackEvent({ outcome: NO_CHANGE }))
            break;
        case CONTROL:
        case SHIFT:
            if (e.key === CONTROL || e.key === META || e.key === SHIFT) {
                store.dispatch(trackEvent({ inputMode: NO_COMMAND, outcome: NO_CHANGE }))
            } else store.dispatch(trackEvent({ outcome: NO_CHANGE }))
            break;
        default:
            store.dispatch(trackEvent({ inputMode: NO_COMMAND, outcome: NO_CHANGE }))
            break;
    }
}

export { keyPressed, keyUpped };