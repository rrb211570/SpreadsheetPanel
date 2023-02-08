import { store } from './../../store/store.js'
import { setTableDimensions } from '../../store/reducers/tableDimensionsSlice.js'
import { updateScrollDimensions } from '../../components/TablePanel/handlers/scrollSnapHandler/scrollSnapHandler.js';
import { parseVerticalAlignment } from '../../components/FormatPanel/components/VerticalAlignment/VerticalAlignment.js';

function updateTableDimensions(styleMap) {
    let h = null;
    let w = null;
    for (const [property, value] of styleMap.entries()) {
        if (property == 'height') h = value;
        else if (property == 'width') w = value;
    }
    store.dispatch(setTableDimensions({ height: h, width: w }));
}

function applyChange(entry, styleMap, val) {
    if (val != null) {
        entry.querySelector('input').value = val;
        entry.querySelector('.cellValueDiv>.cellValue').innerText = val;
    }
    for (const [property, value] of styleMap.entries()) {
        switch (property) {
            case 'height':
                entry.style.height = value + 'px';
                if ([...entry.classList].filter(name => /^col0$/.test(name)).length != 0) {
                    entry.style.lineHeight = value + 'px';
                }
                if ([...entry.classList].filter(name => /^row0$/.test(name)).length == 0 &&
                    [...entry.classList].filter(name => /^col0$/.test(name)).length == 0 &&
                    [...entry.classList].filter(name => /^col\d+$/.test(name)).length != 0) {
                    entry.querySelector('.coverDiv').style.height = value + 'px';
                }
                break;
            case 'width':
                entry.style.width = value + 'px';
                if ([...entry.classList].filter(name => /^row0$/.test(name)).length == 0 &&
                    [...entry.classList].filter(name => /^col0$/.test(name)).length == 0 &&
                    [...entry.classList].filter(name => /^col\d+$/.test(name)).length != 0) {
                    entry.querySelector('input').style.width = value - 4 + 'px';
                    entry.querySelector('.coverDiv').style.width = value + 'px';
                }
                break;
            case 'marginLeft':
                entry.style.marginLeft = value + 'px';
                break;
            case 'fontWeight':
                entry.querySelector('.cellValue').style.fontWeight = value;
                break;
            case 'fontStyle':
                entry.querySelector('.cellValue').style.fontStyle = value;
                break;
            case 'textDecoration':
                entry.querySelector('.cellValue').style.textDecoration = value;
                break;
            case 'cellColor':
                entry.querySelector('.cellValueDiv').style.backgroundColor = value;
                break;
            case 'fontColor':
                entry.querySelector('.cellValue').style.color = value;
                break;
            case 'horizontalAlignment':
                entry.querySelector('.cellValue').style.textAlign = value;
                break;
            case 'verticalAlignment':
                let parsedValue = parseVerticalAlignment(value);
                entry.querySelector('.cellValueDiv').style.justifyContent = parsedValue;
                break;
            case 'fontFamily':
                entry.querySelector('.cellValue').style.fontFamily = value;
                break;
            case 'fontSize':
                entry.querySelector('.cellValue').style.fontSize = value + 'px';
                break;
            case 'borders':
                let boxShadows = '';
                for (let i = 0; i < value.length; ++i) {
                    switch (value[i]) {
                        case 'top': boxShadows += 'inset 0 3px 0 -1px black';
                            break;
                        case 'right': boxShadows += 'inset -3px 0 0 -1px black';
                            break;
                        case 'bottom': boxShadows += 'inset 0 -3px 0 -1px black';
                            break;
                        case 'left': boxShadows += 'inset 3px 0 0 -1px black';
                            break;
                        case 'none': boxShadows = 'none';
                            break;
                        default: break;
                    }
                    if (i < value.length - 1) boxShadows += ',';
                }
                if (boxShadows == '') boxShadows = 'none';
                entry.querySelector('.cellValueDiv').style.boxShadow = boxShadows;
                break;
            default: break;
        }
    }
}

function applyGroupChange(group, styleMap) {
    if (/^\.col\d+$/.test(group)) {
        for (const [property, value] of styleMap) {
            if (property == 'width') {
                let entries = document.querySelectorAll(group);
                let dx = value - parseInt(entries[0].style.width, 10);
                entries[0].style.width = value + 'px';
                for (let i = 1; i < entries.length; ++i) {
                    entries[i].style.width = value + 'px';
                    entries[i].querySelector('input').style.width = value - 8 + 'px';
                    entries[i].querySelector('.coverDiv').style.width = value + 'px';
                }
                let colNum = parseInt(group.match(/(\d+)/)[0], 10);
                let elem;
                while ((elem = document.querySelector(`.col${++colNum}`)) != null) {
                    let entries = document.querySelectorAll(`.col${colNum}`);
                    for (let i = 0; i < entries.length; ++i) {
                        entries[i].style.marginLeft = parseInt(entries[i].style.marginLeft, 10) + dx + 'px';
                    }
                }
                document.querySelector('#scrollBarLayer').style.width = store.getState().tableDimensions.width - 50 + 'px';
                updateScrollDimensions();
            }
        }
    } else if (/^\.row\d+$/.test(group)) {
        for (const [property, value] of styleMap) {
            if (property == 'height') {
                let entries = document.querySelectorAll(group);
                entries[0].style.height = value + 'px';
                entries[1].style.height = value + 'px';
                entries[1].style.lineHeight = value + 'px';
                for (let i = 2; i < entries.length; ++i) {
                    entries[i].style.height = value + 'px';
                    entries[i].querySelector('.coverDiv').style.height = value + 'px';
                }
                document.querySelector('#scrollBarLayer').style.height = store.getState().tableDimensions.height - 22 + 'px';
                updateScrollDimensions();
            }
        }
    }
}

export { updateTableDimensions, applyChange, applyGroupChange };