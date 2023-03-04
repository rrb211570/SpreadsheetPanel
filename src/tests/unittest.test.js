import reducer, { newHistoryState } from '../store/reducers/historySlice.js'
import Data from '../data/data.js'
import { createTextChangeData } from '../components/TablePanel/handlers/cellHandler/textChangeHandler/textChangeHandler.js'
import { updatePrevRecordedData } from '../data/modifiers/recordChange.js'
import updateCollectedData from '../data/modifiers/updateCollectedData.js'

test('should return the initial state', () => {
    expect(reducer(undefined, { type: undefined })).toEqual(
        {
            loadedSheet: null,
            changeHistory: [new Data()],
            changeHistoryIndex: 0,
            collectedData: new Data(),
            sentData: new Data()
        }
    )
})

let [prevData, newData] = [createTextChangeData(1, 2, ''), createTextChangeData(1, 2, 'blah')];
let [prevRecordedData, updatedCollectedData] = [updatePrevRecordedData(prevData), updateCollectedData(newData)];
/*
test('should handle textChange event being added to empty changeHistory', () => {
    const previousState = {
        loadedSheet: null,
        changeHistory: [new Data()],
        changeHistoryIndex: 0,
        collectedData: new Data(),
        sentData: new Data()
    }

    expect(reducer(previousState, newHistoryState({
        prevRecordedData: prevRecordedData,
        dataAfterChange: newData,
        collectedData: updatedCollectedData
    }))).toEqual(
        {
            loadedSheet: null,
            changeHistory: [new Data(), new Data()],
            changeHistoryIndex: 1,
            collectedData: new Data(),
            sentData: new Data()
        }
    )
})

/*
test('should handle a todo being added to an existing list', () => {
    const previousState = [{ text: 'Run the tests', completed: true, id: 0 }]

    expect(reducer(previousState, newHistoryState('Use Redux'))).toEqual([
        { text: 'Run the tests', completed: true, id: 0 },
        { text: 'Use Redux', completed: false, id: 1 }
    ])
})
    */