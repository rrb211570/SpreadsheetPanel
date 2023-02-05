import { store } from '../../../../../store/store.js'
import { setSelection } from '../../../../../store/reducers/selectionSlice.js'

function applySelectionHandler(entryCell) {
    const selectionLayer = entryCell.querySelector('.coverDiv');
    const input = entryCell.querySelector('input');

    selectionLayer.addEventListener('mousedown', selectionLayerClickHandler);
    input.addEventListener('blur', inputBlurHandler);
    selectionLayer.addEventListener('dblclick', selectionLayerDoubleClickHandler);
}

function selectionLayerClickHandler(e) {
    for (const cell of store.getState().selection.entries.values()) {
        let [rowNum, colNum] = cell.split(',');
        document.querySelector(`.row${rowNum}.col${colNum}>.coverDiv`).style.boxShadow = 'none';
    }

    e.target.focus();
    e.target.style.boxShadow = 'inset 0 0 0 2px blue';
    e.target.style.outline = 'none';

    const rowNum = parseInt([...e.target.parentElement.classList].filter(name => /^row\d+$/.test(name))[0].match(/(\d+)/)[0], 10);
    const colNum = parseInt([...e.target.parentElement.classList].filter(name => /^col\d+$/.test(name))[0].match(/(\d+)/)[0], 10);
    let cellValueDiv = e.target.parentElement.querySelector('.cellValueDiv');
    let cellValue = e.target.parentElement.querySelector('.cellValue');
    let categories = {
        fontFamily: cellValue.style.fontFamily,
        fontSize: cellValue.style.fontSize == '' ? '12px' : cellValue.style.fontSize,
        fontWeight: cellValue.style.fontWeight == '' ? '400' : cellValue.style.fontWeight,
        fontStyle: cellValue.style.fontStyle == '' ? 'normal' : cellValue.style.fontStyle,
        textDecoration: cellValue.style.textDecoration == '' ? 'none' : cellValue.style.textDecoration,
        fontColor: cellValue.style.color == '' ? 'black' : cellValue.style.color,
        cellColor: cellValueDiv.style.backgroundColor == '' ? 'white' : cellValueDiv.style.backgroundColor,
        borders: cellValueDiv.style.boxShadow == '' ? [] : parseBoxShadow(cellValueDiv.style.boxShadow),
        horizontalAlignment: cellValue.style.textAlign == '' ? 'center' : cellValue.style.textAlign,
        verticalAlignment: cellValueDiv.style.justifyContent == '' ? 'center' : parseVerticalAlignment(cellValueDiv.style.justifyContent),
    }
    updateFormatPanelHighlights(categories);
    store.dispatch(setSelection({ newEntries: [`${rowNum},${colNum}`], categories: categories }));
    updateCellViewPanel([`${rowNum},${colNum}`]);
    // css effect (cut/copy/paste)
}

function updateFormatPanelHighlights(categories) {
    if (categories.fontWeight == '400') document.querySelector('.bold__btn').style.backgroundColor = 'white';
    else document.querySelector('.bold__btn').style.backgroundColor = 'rgb(204, 255, 162)';
    if (categories.fontStyle == 'normal') document.querySelector('.italic__btn').style.backgroundColor = 'white';
    else document.querySelector('.italic__btn').style.backgroundColor = 'rgb(204, 255, 162)';
    if (categories.textDecoration == 'none') document.querySelector('.strikethrough__btn').style.backgroundColor = 'white';
    else document.querySelector('.strikethrough__btn').style.backgroundColor = 'rgb(204, 255, 162)';
}

function updateCellViewPanel(selectedEntries) {
    let cell = selectedEntries.values().next().value;
    let [rowNum, colNum] = cell.split(',');
    let cellValue = document.querySelector(`.row${rowNum}.col${colNum}>.cellValueDiv>.cellValue`);
    if (cellValue == null) return '';
    document.querySelector('#cellViewPanel__cellTextValue').innerText = cellValue.innerText;
}

function parseBoxShadow(term) {
    let boxShadowLabels = [];
    if (term.includes('black 0px 3px 0px -1px inset')) boxShadowLabels.push('top');
    if (term.includes('black -3px 0px 0px -1px inset')) boxShadowLabels.push('right');
    if (term.includes('black 0px -3px 0px -1px inset')) boxShadowLabels.push('bottom');
    if (term.includes('black 3px 0px 0px -1px inset')) boxShadowLabels.push('left');
    return boxShadowLabels;
}

function parseVerticalAlignment(term) {
    switch (term) {
        case 'flex-start': return 'top';
        case 'center': return 'center';
        case 'flex-end': return 'bottom';
        default: break;
    }
}

function inputBlurHandler(e) {
    e.target.parentElement.querySelector('.coverDiv').style.zIndex = 2;
    e.target.style.opacity = 0;
    e.target.parentElement.querySelector('.cellValue').style.opacity = 1;
}

function selectionLayerDoubleClickHandler(e) {
    e.target.style.zIndex = -1;
    e.target.parentElement.querySelector('.cellValue').style.opacity = 0;
    e.target.parentElement.querySelector('input').style.opacity = 1;
    e.target.parentElement.querySelector('input').focus();
}

export { applySelectionHandler, parseBoxShadow };