import { batchTurn, nextTurn, concludeTestingBatch } from './../../../tests/sequenceHelpers.js'
import { boldTest } from '../components/Bold/boldTest.js';
import { italicTest } from '../components/Italic/italicTest.js';
import { strikethroughTest } from '../components/Strikethrough/strikethroughTest.js';
import { fontFamilyTest } from '../components/FontFamily/fontFamilyTest.js';
import { fontSizeTest } from '../components/FontSize/fontSizeTest.js';
import { fontColorTest } from '../components/FontColor/fontColorTest.js';
import { cellColorTest } from '../components/CellColor/cellColorTest.js';
import { bordersTest } from '../components/Borders/bordersTest.js';
import { horizontalAlignmentTest } from '../components/HorizontalAlignment/horizontalAlignmentTest.js';
import { verticalAlignmentTest } from '../components/VerticalAlignment/verticalAlignmentTest.js';

const t = {
    FONT_FAMILY: 'FONT_FAMILY',
    FONT_SIZE: 'FONT_SIZE',
    BOLD: 'BOLD',
    ITALIC: 'ITALIC',
    STRIKETHROUGH: 'STRIKETHROUGH',
    FONT_COLOR: 'FONT_COLOR',
    CELL_COLOR: 'CELL_COLOR',
    BORDERS: 'BORDERS',
    HORIZONTAL_ALIGNMENT: 'HORIZONTAL_ALIGNMENT',
    VERTICAL_ALIGNMENT: 'VERTICAL_ALIGNMENT',
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
            case t.FONT_FAMILY:
                fontFamilyTest(atomicTurn);
                break;
            case t.FONT_SIZE:
                fontSizeTest(atomicTurn);
                break;
            case t.BOLD:
                boldTest(atomicTurn);
                break;
            case t.ITALIC:
                italicTest(atomicTurn);
                break;
            case t.STRIKETHROUGH:
                strikethroughTest(atomicTurn);
                break;
            case t.FONT_COLOR:
                fontColorTest(atomicTurn);
                break;
            case t.CELL_COLOR:
                cellColorTest(atomicTurn);
                break;
            case t.BORDERS:
                bordersTest(atomicTurn);
                break;
            case t.HORIZONTAL_ALIGNMENT:
                horizontalAlignmentTest(atomicTurn);
                break;
            case t.VERTICAL_ALIGNMENT:
                verticalAlignmentTest(atomicTurn);
                break;
            default: break;
        }
    }
    concludeTestingBatch(atomicTurn);
}

export default unitTest;