import endToEnd from './../../../tests/endToEnd.js'

import { batchTurn , nextTurn, concludeTestingBatch } from './../../../tests/sequenceHelpers.js'

const t = {
    ENDTOEND: 'ENDTOEND'
};

function appTest(testsToRun) {
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
            case t.ENDTOEND:
                endToEnd(atomicTurn);
                break;
            default: break;
        }
    }
    concludeTestingBatch(atomicTurn, batchTurn);
}

export default appTest;