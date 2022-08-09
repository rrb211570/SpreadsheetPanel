import {getInLine} from './sequenceHelpers.js'

let featureTurn = {
    current: 1,
    nextAvailable: 1
};

let testSequence = new Map();

function sequenceTests(whichTests){
    for(const key of whichTests.keys()){
        testSequence.set(key, {
            turnNumber: getInLine(featureTurn),
            tests: whichTests.get(key)
        });
    }
}

export {featureTurn, sequenceTests, testSequence};