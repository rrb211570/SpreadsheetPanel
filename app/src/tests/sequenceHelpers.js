let batchTurn = {
    current: 1,
    nextAvailable: 1
};

let testSequence = new Map();

function sequenceTests(whichTests) {
    for (const key of whichTests.keys()) {
        testSequence.set(key, {
            turnNumber: getInLine(batchTurn),
            tests: whichTests.get(key)
        });
    }
}

function getInLine(turn) {
    let myTurnNumber = turn.nextAvailable++;
    return myTurnNumber;
}

function nextTurn(turn) {
    turn.current++;
}

function concludeTestingBatch(atomicTurn, batchTurn) {
    let timer = setInterval(() => {
        if (atomicTurn.current == atomicTurn.nextAvailable) { // if all turns have finished
            nextTurn(batchTurn);
            clearInterval(timer);
        }
    }, 100);
}

export { batchTurn, testSequence, sequenceTests, getInLine, nextTurn, concludeTestingBatch };