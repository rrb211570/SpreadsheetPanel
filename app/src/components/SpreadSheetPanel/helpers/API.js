
let loadSheetAPI = async (id, rootURL) => {
    const response = await fetch(rootURL + 'loadSheet/' + id, { credentials: 'include' });
    const body = await response.json();

    if (response.status !== 200) {
        throw Error(body.message)
    }
    return body;
}
let saveAPI = async (id, rootURL) => {
    let exposedCollectedData = exposeCollectedData(this.props.collectedData);
    const response = await fetch(rootURL + 'saveSheet/' + id, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            exposedCollectedData: exposedCollectedData
        }),
        credentials: 'include'
    });
    const body = response.json();
    if (response.status !== 200) {
        throw Error(body.message)
    }
    return body;
}
function exposeCollectedData(data) {
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

export {loadSheetAPI, saveAPI};