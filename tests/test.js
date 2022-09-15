
let fg = 1;
console.log('fg is: ' + fg);

const { Builder, By, until } = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');
const myOptions = new firefox.Options();
myOptions.addArguments("--headless");

console.log('2 is: ' + 2);
(async function example() {
    try {
        let driver = await new Builder()
            .forBrowser('firefox')
            .setFirefoxOptions(myOptions)
            .build();
        try {
            let testNum = 1;
            console.log('testNum is: ' + testNum);
            await driver.get('http://localhost:3000/');
            let elem = await driver.findElement(By.id('testConsoleStatus'));
            await driver.wait(until.elementTextContains(elem, 'NEXT'));
    
            while (true) {
                await driver.wait(until.elementTextContains(elem, parseInt(testNum, 10) + 1));
                let statusText = await elem.getText();
                if (/.*FAIL.*/.test(statusText)) {
                    let errText = await driver.findElement(By.id('testConsoleError')).getText();
                    console.log('\n' + errText);
                    process.exitCode = 1;
                    break;
                } else if (/.*SUCCESS.*/.test(statusText)) {
                    console.log('ALL TESTS PASSED SUCCESSFULLY');
                    break;
                }
                let logText = await driver.findElement(By.id('testConsoleLog')).getText();
                let logTextArr = logText.split(',');
                console.log(logTextArr[logTextArr.length - 1]);
                testNum++;
            }
        } finally {
            await driver.quit();
            process.exit();
        }
    } catch (e) {
        console.log('myError: ' + e);
    }
})();