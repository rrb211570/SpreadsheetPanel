const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express();
const { Builder, By, until } = require('selenium-webdriver');

(async function example() {
    let driver = await new Builder().forBrowser('firefox').build();
    try {
        let testNum = 1;
        await driver.get('http://localhost:3000/');
        let elem = await driver.findElement(By.id('testConsoleStatus'));
        await driver.wait(until.elementTextContains(elem, 'NEXT'));

        while (true) {
            await driver.wait(until.elementTextContains(elem, parseInt(testNum, 10) + 1));
            let statusText = await elem.getText();
            if (!/.*NEXT.*/.test(statusText)) {
                if (/.*SUCCESS.*/.test(statusText)) console.log('ALL TESTS PASSED SUCCESSFULLY');
                else if (/.*FAIL.*/.test(statusText)) {
                    let errText = await driver.findElement(By.id('testConsoleError')).getText();
                    console.log('\n' + errText);
                    await driver.quit();
                    process.exitCode = 1;
                }
                break;
            }
            let logText = await driver.findElement(By.id('testConsoleLog')).getText();
            let logTextArr = logText.split(',');
            console.log(logTextArr[logTextArr.length - 1]);
            testNum++;
        }
    } finally {
        await driver.quit();
    }
})();