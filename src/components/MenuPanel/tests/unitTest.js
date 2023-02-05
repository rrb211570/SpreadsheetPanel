import { menuInteractionTest } from './MenuInteractionTest.js';

import { batchTurn , nextTurn, concludeTestingBatch } from './../../../tests/sequenceHelpers.js'

const t = {
    MENU_INTERACTION: 'MENU_INTERACTION'
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
            case t.MENU_INTERACTION:
                //menuInteractionTests(atomicTurn);
                break;
            default: break;
        }
    }
    concludeTestingBatch(atomicTurn, batchTurn);
}

export default unitTest;