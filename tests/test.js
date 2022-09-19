const core = require('@actions/core');
const { Builder, By, until } = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');
const myOptions = new firefox.Options();
myOptions.addArguments("--headless");

(async function example() {
    try {
        let driver = await new Builder()
            .forBrowser('firefox')
            .setFirefoxOptions(myOptions)
            .build();
        try {
            await driver.get('http://localhost:3000/');
            let elem = await driver.findElement(By.id('testConsoleStatus'));
            await driver.wait(until.elementTextContains(elem, 'NEXT'));
    
            while (true) {
                await driver.wait(until.elementTextContains(elem, parseInt(testNum, 10) + 1));
                let statusText = await elem.getText();
                if (/.*FAIL.*/.test(statusText)) {
                    let errText = await driver.findElement(By.id('testConsoleError')).getText();
                    throw errText;
                } else if (/.*SUCCESS.*/.test(statusText)) {
                    console.log('ALL TESTS PASSED SUCCESSFULLY');
                    throw 'blah';
                    break;
                }
                let logText = await driver.findElement(By.id('testConsoleLog')).getText();
                let logTextArr = logText.split(',');
                console.log(logTextArr[logTextArr.length - 1]);
                testNum++;
            }
        } finally {
            core.setOutput("testingSuccess", true);
            await driver.quit();
            process.exit();
        }
    } catch (e) {
        core.setOutput("testingSuccess", false);
        core.setFailed(errMsg);
        process.exit(1);
    }
})();