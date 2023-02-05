import endToEnd from './../../../tests/endToEnd.js'

import { batchTurn, nextTurn, concludeTestingBatch } from './../../../tests/sequenceHelpers.js'

const t = {
    END_TO_END: 'END_TO_END',
    INTEGRATION: 'INTEGRATION'
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
            case t.END_TO_END:
                endToEnd(atomicTurn);
                break;
            case t.INTEGRATION: break;
            default: break;
        }
    }
    concludeTestingBatch(atomicTurn);
}

export default appTest;