import { store } from '../../../../../store/store.js'
import { setSelection } from '../../../../../store/reducers/selectionSlice.js'

function applySelectionHandler(entryCell) {
    const selectionLayer = entryCell.querySelector('.selectionLayer');
    const input = entryCell.querySelector('input');

    selectionLayer.addEventListener('mousedown', selectionLayerClickHandler);
    input.addEventListener('blur', inputBlurHandler);
    selectionLayer.addEventListener('blur', selectionLayerBlurHandler);
    selectionLayer.addEventListener('dblclick', selectionLayerDoubleClickHandler);
}

function selectionLayerClickHandler(e) {
    e.target.focus();
    e.target.parentElement.querySelector('.highlightLayer').style.border = '2px solid blue';

    const rowNum = parseInt([...e.target.parentElement.classList].filter(name => /^row\d+$/.test(name))[0].match(/(\d+)/)[0], 10);
    const colNum = parseInt([...e.target.parentElement.classList].filter(name => /^col\d+$/.test(name))[0].match(/(\d+)/)[0], 10);
    store.dispatch(setSelection({ newEntries: [`${rowNum},${colNum}`]}));

    // css effect (cut/copy/paste)
}

function inputBlurHandler(e) {
    e.target.parentElement.querySelector('.selectionLayer').style.zIndex = 2;
    e.target.parentElement.querySelector('.highlightLayer').style.zIndex = 1;
}

function selectionLayerBlurHandler(e) {
    e.target.parentElement.querySelector('.highlightLayer').style.border = 'none';
}

function selectionLayerDoubleClickHandler(e) {
    e.target.style.zIndex = -1;
    e.target.parentElement.querySelector('.highlightLayer').style.zIndex = -2;
    e.target.parentElement.querySelector('input').focus();
}

export default applySelectionHandler;