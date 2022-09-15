import { getInLine, nextTurn } from "../../../../tests/sequenceHelpers";
import assembleTableData from './helpers/assembleTableData.js'
import { getRowsCols } from './helpers/constructTableModel.js'

function buildSheetTest(atomicTurn, loadedSheet, rows, cols, defaultCellHeight, defaultCellWidth) {
    let myTurnNumber = getInLine(atomicTurn);
    let timer;

    timer = setInterval(() => {
        try {
            if (atomicTurn.current == myTurnNumber) {
                console.log('\n--------BUILD TEST-----------------------');
                let tableData = assembleTableData(loadedSheet, rows, cols, defaultCellHeight, defaultCellWidth);
                [rows, cols] = getRowsCols(tableData);

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
                        let entryCellData = tableData[i + 1][j + 1];

                        if (entryCell.querySelector('input').value != entryCellData.val) throw 'DOM value does not match tableData for cell: row' + i + ' col' + j + ' ' + entryCellData.val;

                        for (let p = 0; p < entryCellData.styleMap.length; ++p) {
                            switch (entryCellData.styleMap[p][0]) {
                                case 'height':
                                    if (parseInt(entryCell.style.height, 10) != entryCellData.styleMap[p][1]) throw 'DOM cell height does not match tableData: row' + i + ' col' + j;
                                    break;
                                case 'width':
                                    if (parseInt(entryCell.style.width, 10) != entryCellData.styleMap[p][1]) throw 'DOM cell width does not match tableData: row' + i + ' col' + j;
                                    break;
                                case 'marginLeft':
                                    if (parseInt(entryCell.style.marginLeft, 10) != entryCellData.styleMap[p][1]) throw 'DOM cell marginLeft does not match tableData: row' + i + ' col' + j;
                                    break;
                                default: break;
                            }
                        }
                    }
                }

                console.log('buildTest successful');
                logSuccess();
                nextTurn(atomicTurn);
                clearInterval(timer);
            }
        } catch (e) {
            console.log('Err: buildSheetTest(): ' + e);
            logError(e);
            clearInterval(timer);
        }
    }, 100);
}
function logSuccess() {
    document.querySelector('#testConsoleLog').innerHTML = document.querySelector('#testConsoleLog').innerHTML + ',buildSheetTest(): PASS';
    let testNum = document.querySelector('#testConsoleStatus').innerHTML.match(/(\d+)/)[0];
    document.querySelector('#testConsoleStatus').innerHTML = parseInt(testNum, 10) + 1 + ' NEXT';
}

function logError(e) {
    document.querySelector('#testConsoleError').innerHTML = 'Err: buildSheetTest(): ' + e;
    let testNum = document.querySelector('#testConsoleStatus').innerHTML.match(/(\d+)/)[0];
    document.querySelector('#testConsoleStatus').innerHTML = parseInt(testNum, 10) + 1 + ' FAIL';
}

export default buildSheetTest;