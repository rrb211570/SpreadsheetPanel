function getInLine(turn) {
    let myTurnNumber = turn.nextAvailable++;
    return myTurnNumber;
}

function nextTurn(turn) {
    turn.current++;
}

export { getInLine, nextTurn };