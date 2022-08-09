import Data from '../data.js';

// At some point, "changeHistory" of the Redux store may be refactored from existing data structure to nested object.
// These serializing functions will help (de)serialize nested object to data structure, to preserve existing code.
function serializeData(data){
    let individualArr = [];
    for (const [entryKey, value] of data.getIndividualEntries()) {
        let individual = { entryKey: entryKey };
        individual.styleMap = [...[...value.getStyleMap().entries()].map(styleEntry => {
            return [styleEntry[0], styleEntry[1]];
        })];
        if (entryKey != 'spreadsheet' && !/.col\d+/.test(entryKey)) individual.row = value.getRow();
        else if (/.col\d+/.test(entryKey)) {
            individual.row = value.getCellRow();
            individual.col = value.getCellCol();
            individual.val = value.getVal();
        }
        individualArr.push(individual);
    }
    let groupArr = [];
    for (const [groupName, styleMap] of data.getGroupEntries()) {
        let group = { groupName: groupName };
        group.styleMap = [...[...styleMap.entries()].map(styleEntry => {
            return [styleEntry[0], styleEntry[1]];
        })];
        groupArr.push(group);
    }
    return { individualData: individualArr, groupData: groupArr };
}

function deserializeData(data) {
    let myData = new Data();
}