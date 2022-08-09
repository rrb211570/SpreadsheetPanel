import resizersTests from '../handlers/resizingHandler/test.js'
import textChangeTest from '../handlers/textChangeHandler/test.js';
import { featureTurn } from './../../../tests/interactionTests.js'
import { nextTurn } from './../../../tests/sequenceHelpers.js'

const t = {
    BUILDSHEET: 'BUILDSHEET',
    RESIZING: 'RESIZING',
    TEXTCHANGE: 'TEXTCHANGE'
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