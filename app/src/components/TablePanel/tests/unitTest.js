import { resizersTests } from '../handlers/resizingHandler/test.js'
import { textChangeTest } from '../handlers/cellHandler/textChangeHandler/test.js';
import { featureTurn } from './../../../tests/interactionTests.js'
import { nextTurn } from './../../../tests/sequenceHelpers.js'
import { selectionTest } from '../handlers/cellHandler/selectionHandler/test.js';

const t = {
    BUILDSHEET: 'BUILDSHEET',
    SELECTION: 'SELECTION',
    TEXTCHANGE: 'TEXTCHANGE',
    RESIZING: 'RESIZING'
};

function unitTest(testsToRun) {
    if (testsToRun.size == 0) {
        nextTurn(featureTurn);
        return;
    }
    let turn = {
        current: 1,
        nextAvailable: 1
    };
    for (const test of testsToRun.values()) {
        switch (test) {
            case t.BUILDSHEET: break;
            case t.SELECTION:
                selectionTest(turn);
                break;
            case t.TEXTCHANGE:
                textChangeTest(turn);
                break;
            case t.RESIZING:
                resizersTests(turn);
                break;
            default: break;
        }
    }
    let timer = setInterval(() => {
        if (turn.current == turn.nextAvailable) {
            nextTurn(featureTurn);
            clearInterval(timer);
        }
    }, 100);
}

export default unitTest;