const core = require('@actions/core');
const { Builder, By, until } = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');
const myOptions = new firefox.Options();
myOptions.addArguments("--headless");

(async function example() {
    try {
        let testNum = 1;
        let driver = await new Builder()
            .forBrowser('firefox')
            .setFirefoxOptions(myOptions)
            .build();
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
                break;
            }
            let logText = await driver.findElement(By.id('testConsoleLog')).getText();
            let logTextArr = logText.split(',');
            console.log(logTextArr[logTextArr.length - 1]);
            testNum++;
        }
        await driver.quit();
    } catch (e) {
        core.setFailed(e);
        process.exit(1);
    } finally {
        process.exit();
    }
})();