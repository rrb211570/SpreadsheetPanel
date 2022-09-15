import React from 'react';

function TestConsolePanel() {
    return (
        <div>
            <p id='testConsoleLog' style={{ height: '1px', width: '1px', opacity: 1, zIndex: -1, position: 'absolute'}}></p>
            <p id='testConsoleError' style={{ height: '1px', width: '1px', opacity: 1, zIndex: -1, position: 'absolute'}}></p>
            <p id='testConsoleStatus' style={{ height: '1px', width: '1px', opacity: 1, zIndex: -1, position: 'absolute'}}>0</p>
        </div>

    )
}

export default TestConsolePanel;