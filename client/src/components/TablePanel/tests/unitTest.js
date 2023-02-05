import { resizersTests } from '../handlers/resizingHandler/test.js'
import { selectionTest } from '../handlers/cellHandler/selectionHandler/test.js';
import { textChangeTest } from '../handlers/cellHandler/textChangeHandler/test.js';
import buildSheetTest from '../../TablePanel/helpers/buildSheet/test.js';

import { batchTurn, nextTurn, concludeTestingBatch } from './../../../tests/sequenceHelpers.js'

const t = {
    BUILD_SHEET: 'BUILD_SHEET',
    SELECTION: 'SELECTION',
    TEXT_CHANGE: 'TEXT_CHANGE',
    RESIZING: 'RESIZING'
};

function unitTest(testsToRun, loadedSheet, rows, cols, defaultCellHeight, defaultCellWidth) {
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
            case t.BUILD_SHEET:
                buildSheetTest(atomicTurn, loadedSheet, rows, cols, defaultCellHeight, defaultCellWidth);
                break;
            case t.SELECTION:
                selectionTest(atomicTurn);
                break;
            case t.TEXT_CHANGE:
                textChangeTest(atomicTurn);
                break;
            case t.RESIZING:
                resizersTests(atomicTurn);
                break;
            default: break;
        }
    }
    concludeTestingBatch(atomicTurn);
}

export default unitTest;