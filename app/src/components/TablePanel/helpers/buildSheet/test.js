import { getInLine, nextTurn } from "../../../../tests/sequenceHelpers";
import { assembleTableData } from './buildSheet.js'

function buildSheetTest(atomicTurn, loadedSheet, rows, cols, defaultHeight, defaultWidth) {
    let myTurnNumber = getInLine(atomicTurn);
    let timer;
    try {
        timer = setInterval(() => {
            if (atomicTurn.current == myTurnNumber) {
                let tableData = assembleTableData(loadedSheet, rows, cols, defaultHeight, defaultWidth);

                // assert that all cells exist, with correct dimensions
                for (let i = 0; i < cols; i++) {
                    for (let i = 0; i < rows; i++) {

                    }
                }

                // assert text values and extra styling, based off tableData

                nextTurn(atomicTurn);
                clearInterval(timer);
            }
        }, 100);
    } catch (e) {
        console.log('Err: buildSheetTest(): ' + e);
        clearInterval(timer);
    }
}

export default buildSheetTest;