import { getInLine, nextTurn } from '../../../tests/sequenceHelpers.js'
import { store } from '../../../store/store.js'

function menuInteractionTest(turn) {
    let axisCellsX = document.querySelectorAll('.AxisX');
    let axisCellsY = document.querySelectorAll('.AxisY');
    let resizeSelections = [[axisCellsX, 10], [axisCellsY, 10], [[axisCellsX[0]], -20], [axisCellsY, -12], [[axisCellsX[0]], 20], [[axisCellsY[0]], 12]]
    try {
        if (resizeSelections.length > 0) checkReactionOfMenuInteractionOnTable(1, resizeSelections[0], turn, true, resizeSelections.length);
        for (let i = 1; i < resizeSelections.length; ++i) checkReactionOfMenuInteractionOnTable(i + 1, resizeSelections[i], turn, false, resizeSelections.length);
    } catch (e) {
        console.log('formatErr: checkReactionOfFormatChange param error: ' + e);
        logError(null, e);
    }
}

function checkReactionOfMenuInteractionOnTable(){

}

function logError(testCaseIndex, e) {
    document.querySelector('#testConsoleError').innerHTML = 'Err: menuInteractionTest(): { testCaseIndex: ' + testCaseIndex + ' } : ' + e;
    let testNum = document.querySelector('#testConsoleStatus').innerHTML.match(/(\d+)/)[0];
    document.querySelector('#testConsoleStatus').innerHTML = parseInt(testNum, 10) + 1 + ' FAIL';
}

export { menuInteractionTest, checkReactionOfMenuInteractionOnTable };