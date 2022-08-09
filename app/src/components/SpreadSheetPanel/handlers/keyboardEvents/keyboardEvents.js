

const NOCOMMAND = 'NoCommand';
const CONTROL = 'Control';
const META = 'Meta'
const SHIFT = 'Shift';
const UNDO = 'Undo';
const REDO = 'Redo';

// Handle CTRL+Z/Y (undo/redo) and CTRL/SHIFT selections.
function keyPressed(e) {
    console.log(e.key.padStart(7, ' ') + ' DOWN');
    switch (this.state.keyEventState) {
        case NOCOMMAND:
            if (e.key === CONTROL || e.key === META) {
                this.setState({ keyEventState: CONTROL, keyOutcome: null });
            } else if (e.key === SHIFT) {
                this.setState({ keyEventState: SHIFT, keyOutcome: null });
            }
            break;
        case CONTROL:
            if (e.key === 'z') {
                this.undo();
            } else if (e.key === 'y') {
                if (this.state.testingKeyInput) this.setState({ keyOutcome: REDO });
                this.redo();
            }
            break;
        case SHIFT:
            break;
        default: break;
    }
}
function keyUpped(e) {
    console.log(e.key.padStart(7, ' ') + ' UP');
    switch (this.state.keyEventState) {
        case NOCOMMAND:
            this.setState({ keyOutcome: null });
            break;
        case CONTROL:
        case SHIFT:
            if (e.key === CONTROL || e.key === META || e.key === SHIFT) {
                this.setState({ keyEventState: NOCOMMAND, keyOutcome: null });
            } else this.setState({ keyOutcome: null });
            break;
        default:
            this.setState({ keyEventState: NOCOMMAND, keyOutcome: null })
            break;
    }
}

export { keyPressed, keyUpped };