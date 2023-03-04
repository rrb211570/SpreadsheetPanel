import Data from '../../../../../data/data.js';
import { recordChange } from '../../../../../data/modifiers/recordChange.js';

function applyTextChangeHandler(entryCell) {
    let changeOccurred = false;
    const input = entryCell.querySelector('input');
    const row = [...entryCell.classList].filter(name => /^row\d+$/.test(name))[0];
    const col = [...entryCell.classList].filter(name => /^col\d+$/.test(name))[0];
    let rowNum = parseInt(row.match(/(\d+)/)[0], 10);
    let colNum = parseInt(col.match(/(\d+)/)[0], 10);
    let prevData;
    let newData;

    const onFocusHandler = (e) => {
        prevData = createTextChangeData(rowNum, colNum, input.value);
        input.addEventListener('change', onChangeHandler);
        input.addEventListener('blur', onBlurHandler);
    }

    const onChangeHandler = (e) => {
        changeOccurred = true;
    }

    const onBlurHandler = (e) => {
        if (changeOccurred) {
            e.target.parentElement.querySelector('.cellValue').innerText = input.value;
            newData = createTextChangeData(rowNum, colNum, input.value);
            recordChange(prevData, newData);
        }
        changeOccurred = false;
        input.removeEventListener('change', onChangeHandler);
        input.removeEventListener('blur', onBlurHandler);
    }

    input.addEventListener('focus', onFocusHandler);
}

function createTextChangeData(rowNum, colNum, value) {
    let myData = new Data();
    myData.setIndividualEntry('.row' + rowNum + '.col' + colNum, new Map(), rowNum, colNum, value);
    return myData;
}

export { applyTextChangeHandler, createTextChangeData };