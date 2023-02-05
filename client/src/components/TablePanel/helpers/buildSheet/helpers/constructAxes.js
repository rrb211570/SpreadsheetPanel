import { getWidth, getMarginLeft, getHeight } from "./util";

let alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

function constructAxisX(tableData, cols, defaultHeight) {
    let keyIndex = 0;
    let axisXCells = [];
    for (let i = 0; i < cols; ++i) {
        try {
            let letter = alphabet[i < 26 ? i : i % 26];
            let width = getWidth(tableData[0][i]);
            let marginLeft = getMarginLeft(tableData[0][i]);
            axisXCells.push(
                <div key={keyIndex++} className={`row0 col${i + 1} AxisX`} style={{ height: `${defaultHeight}px`, width: `${width}px`, marginLeft: `${marginLeft}px`, lineHeight: `${defaultHeight - 2}px` }}>
                    <p style={{ margin: 0 }}>{letter}</p>
                    <div className='resizer-horizontal'></div>
                </div>)
        } catch (e) {
            throw 'Error: ' + i + ' ' + e;
        }
    }

    return <div key={keyIndex++} id='axisX' style={{ position: 'absolute', zIndex: 3, height: `${defaultHeight}px`, marginLeft: '50px' }}>{axisXCells}</div>;
}

function constructAxisY(tableData, rows, defaultWidth) {
    let keyIndex = 0;
    let axisYCells = [];
    for (let i = 0; i < rows; ++i) {
        try {
            let height = getHeight(tableData[i][1]);
            axisYCells.push(
                <div key={keyIndex++} className={`row${i + 1} col0 AxisY`} style={{ height: `${height}px`, width: `${defaultWidth / 2}px` }}>
                    <p style={{ margin: 0 }}>{i + 1}</p>
                    <div className='resizer-vertical'></div>
                </div>);
        } catch (e) {
            throw 'Error: ' + i + ' ' + e;
        }
    }
    return <div key={keyIndex++} id='axisY' style={{ position: 'absolute', zIndex: 3, width: `${defaultWidth / 2}px` }}>{axisYCells}</div>;
}

export { constructAxisX, constructAxisY };