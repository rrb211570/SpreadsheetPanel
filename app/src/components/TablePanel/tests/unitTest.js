import { resizersTests } from '../handlers/resizingHandler/test.js'
import { selectionTest } from '../handlers/cellHandler/selectionHandler/test.js';
import { textChangeTest } from '../handlers/cellHandler/textChangeHandler/test.js';

import { batchTurn, nextTurn, concludeTestingBatch} from './../../../tests/sequenceHelpers.js'

const t = {
    BUILDSHEET: 'BUILDSHEET',
    SELECTION: 'SELECTION',
    TEXTCHANGE: 'TEXTCHANGE',
    RESIZING: 'RESIZING'
};

function unitTest(testsToRun) {
    if (testsToRun.size == 0) {
        nextTurn(batchTurn);
        return;
    }
    let atomicTurn = {
        current: 1,
        nextAvailable: 1
    };
    for (const test of testsToRun.values()) {
        switch (test) {
            case t.BUILDSHEET: break;
            case t.SELECTION:
                selectionTest(atomicTurn);
                break;
            case t.TEXTCHANGE:
                textChangeTest(atomicTurn);
                break;
            case t.RESIZING:
                resizersTests(atomicTurn);
                break;
            default: break;
        }
    }
    concludeTestingBatch(atomicTurn, batchTurn);
}



export default unitTest;