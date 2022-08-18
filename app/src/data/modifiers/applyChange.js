import { store } from './../../store/store.js'
import { setSheetDimensions } from './../../store/reducers/sheetDimensionsSlice.js'

function updateSheetDimensions(styleMap) {
    let h = null;
    let w = null;
    for (const [property, value] of styleMap.entries()) {
        if (property == 'height') h = value;
        else if (property == 'width') w = value;
    }
    document.getElementById('spreadsheet').querySelectorAll('.resizer-horizontal').forEach(resizer => {
        if (h != null) resizer.style.height = h + 'px';
    });
    document.getElementById('spreadsheet').querySelectorAll('.resizer-vertical').forEach(resizer => {
        if (w != null) resizer.style.width = w + 'px';
    });
    store.dispatch(setSheetDimensions({ tableHeight: h, tableWidth: w }));
}

function applyChange(entry, styleMap, val) {
    if (val != null) entry.querySelector('input').value = val;
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
                    entry.querySelector('input').style.height = value - 4 + 'px';
                    entry.querySelector('#cover').style.height = value + 'px';
                }
                break;
            case 'width':
                entry.style.width = value + 'px';
                if ([...entry.classList].filter(name => /^row0$/.test(name)).length == 0 &&
                    [...entry.classList].filter(name => /^col0$/.test(name)).length == 0 &&
                    [...entry.classList].filter(name => /^col\d+$/.test(name)).length != 0) {
                    entry.querySelector('input').style.width = value - 4 + 'px';
                    entry.querySelector('#cover').style.width = value + 'px';
                }
                break;
            case 'marginLeft':
                entry.style.marginLeft = value + 'px';
                break;
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
                    entries[i].querySelector('.selectionLayer').style.width = value + 'px';
                    entries[i].querySelector('.highlightLayer').style.width = value - 4 + 'px';
                }
                let colNum = parseInt(group.match(/(\d+)/)[0], 10);
                let elem = null;
                while ((elem = document.querySelector(`.col${++colNum}`)) != null) {
                    let entries = document.querySelectorAll(`.col${colNum}`);
                    for (let i = 0; i < entries.length; ++i) {
                        entries[i].style.marginLeft = parseInt(entries[i].style.marginLeft, 10) + dx + 'px';
                    }
                }
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
                    entries[i].querySelector('input').style.height = value - 6 + 'px';
                    entries[i].querySelector('.selectionLayer').style.height = value + 'px';
                    entries[i].querySelector('.highlightLayer').style.height = value - 4 + 'px';
                }
            }
        }
    }
}

export { updateSheetDimensions, applyChange, applyGroupChange };