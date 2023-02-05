import { store } from "../../../../store/store";
import { logError, logSuccess } from "../../../../tests/helper";
import { getInLine, nextTurn } from "../../../../tests/sequenceHelpers";
import assembleTableData from './helpers/assembleTableData.js';
import { getRowsCols } from './helpers/util.js';

function buildSheetTest(atomicTurn, loadedSheet, rows, cols, defaultCellHeight, defaultCellWidth) {
    let myTurnNumber = getInLine(atomicTurn);
    let timer;

    timer = setInterval(() => {
        try {
            if (atomicTurn.current == myTurnNumber) {
                console.log('\n--------BUILD TEST-----------------------');
                let tableData = assembleTableData(loadedSheet, rows, cols, defaultCellHeight, defaultCellWidth);
                [rows, cols] = [store.getState().tableDimensions.totalRows, store.getState().tableDimensions.totalCols];

                // assert that all axis cells exist
                let axisCellsX = document.querySelectorAll('.AxisX');
                let axisCellsY = document.querySelectorAll('.AxisY');
                if (axisCellsX.length != cols || axisCellsY.length != rows) throw 'incorrect rows/cols in DOM: cols ' + axisCellsX.length + ' rows ' + axisCellsY.length;
                for (let i = 0; i < rows; ++i) {
                    if (document.querySelectorAll(`.row${i + 1}.entryCell`).length != cols) throw 'incorrect #entryCells for row: ' + i + 1;
                }

                // assert that each cell has correct value and styling
                for (let i = 0; i < rows; i++) {
                    for (let j = 0; j < cols; j++) {
                        let entryCell = document.querySelector(`.row${i + 1}.col${j + 1}.entryCell`);
                        let entryCellData = tableData[i][j];

                        if (entryCell.querySelector('input').value != entryCellData.val) throw 'DOM value does not match tableData for cell: row' + (i + 1) + ' col' + (j + 1) + ' ' + entryCellData.val;

                        for (let p = 0; p < entryCellData.styleMap.length; ++p) {
                            switch (entryCellData.styleMap[p][0]) {
                                case 'height':
                                    if (parseInt(entryCell.style.height, 10) != entryCellData.styleMap[p][1]) throw 'DOM cell height does not match tableData: row' + (i + 1) + ' col' + (j + 1);
                                    break;
                                case 'width':
                                    if (parseInt(entryCell.style.width, 10) != entryCellData.styleMap[p][1]) throw 'DOM cell width does not match tableData: row' + (i + 1) + ' col' + (j + 1);
                                    break;
                                case 'marginLeft':
                                    if (parseInt(entryCell.style.marginLeft, 10) != entryCellData.styleMap[p][1]) throw 'DOM cell marginLeft does not match tableData: row' + (i + 1) + ' col' + (j + 1);
                                    break;
                                default: break;
                            }
                        }
                    }
                }

                console.log('buildTest successful');
                logSuccess('buildTest()', 1);
                nextTurn(atomicTurn);
                clearInterval(timer);
            }
        } catch (e) {
            let errMsg = 'Err: buildSheetTest(): ' + e;
            console.log(errMsg);
            logError(errMsg);
            clearInterval(timer);
        }
    }, 100);
}

export default buildSheetTest;