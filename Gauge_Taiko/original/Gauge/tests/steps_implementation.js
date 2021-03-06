"use strict";

const path = require('path');
const fs = require('fs');
const os = require('os');
const rimraf = require('rimraf');
const {
    $,
    above,
    accept,
    alert,
    attach,
    below,
    button,
    checkBox,
    clear,
    click,
    client,
    closeBrowser,
    closeTab,
    confirm,
    deleteCookies,
    dismiss,
    doubleClick,
    dragAndDrop,
    dropDown,
    evaluate,
    fileField,
    focus,
    getConfig,
    goBack,
    goForward,
    goto,
    highlight,
    hover,
    intercept,
    into,
    link,
    listItem,
    mouseAction,
    near,
    openBrowser,
    press,
    prompt,
    radioButton,
    reload,
    rightClick,
    screenshot,
    scrollDown,
    scrollTo,
    scrollUp,
    setConfig,
    switchTo,
    tableCell,
    text,
    textBox,
    toLeftOf,
    toRightOf,
    waitFor,
    write,
} = require('taiko');
const assert = require("assert");
const utils = require('./utils');

const headless = process.env.headless_chrome.toLowerCase() === 'true';
const waitForTimeout = 60000 // ms

beforeSuite(async (context) => {
    setConfig({
        observe: false,
        observeTime: 500,
        navigationTimeout: 120000
    });
});

beforeSpec(async (context) => {
});

beforeScenario(async (context) => {
    let chromiumTempProfileParentDir = process.env.CHROMIUM_PROFILE_PARENT_DIR || os.tmpdir();
    gauge.dataStore.scenarioStore.put('CHROMIUM_TEMP_PROFILE_PARENT_DIR', chromiumTempProfileParentDir);

    await fs.promises.mkdtemp(chromiumTempProfileParentDir + path.sep)
        .then(async (directory) => {
            utils.message('Chromium profile directory set to: ' + directory);

            gauge.dataStore.scenarioStore.put('CHROMIUM_PROFILE_DIR', directory);

            await openBrowser({
                headless: headless,
                    args: [
                        '--incognito',
                        '--user-data-dir=' + directory,
                        '--window-size=1280,720',
                        '--window-position=0,0',

                        // The following arguments are taken from puppeteer source code
                        '--disable-background-networking',
                        '--enable-features=NetworkService,NetworkServiceInProcess',
                        '--disable-background-timer-throttling',
                        '--disable-backgrounding-occluded-windows',
                        '--disable-breakpad',
                        '--disable-client-side-phishing-detection',
                        '--disable-component-extensions-with-background-pages',
                        '--disable-default-apps',
                        '--disable-dev-shm-usage',
                        '--disable-extensions',
                        '--disable-features=Translate',
                        '--disable-hang-monitor',
                        '--disable-ipc-flooding-protection',
                        '--disable-popup-blocking',
                        '--disable-prompt-on-repost',
                        '--disable-renderer-backgrounding',
                        '--disable-sync',
                        '--force-color-profile=srgb',
                        '--metrics-recording-only',
                        '--no-first-run',
                        '--enable-automation',
                        '--password-store=basic',
                        '--use-mock-keychain',
                        '--disable-gpu',
                        '--disable-dev-shm-usage',
                        '--disable-setuid-sandbox',
                        '--no-sandbox',
                        '--no-zygote'
                ]
            });
        })
        .catch(async (err) => {
            utils.message(err);
        });
});

beforeStep(async (context) => {
});

afterStep(async (context) => {
});

afterScenario(async (context) => {
    await closeBrowser();
    destroyBrowserUserDir();
});

afterSpec(async () => {
});

afterSuite(async (context) => {
});

function destroyBrowserUserDir() {
    let tempProfileDir = gauge.dataStore.scenarioStore.get('CHROMIUM_PROFILE_DIR');
    utils.message('Chromium profile directory cleanup: ' + tempProfileDir);

    try {
        rimraf.sync(tempProfileDir);
    } catch(e) {}
}

// Return a screenshot file name
gauge.customScreenshotWriter = async function () {
    const screenshotFilePath = path.join(process.env['gauge_screenshots_dir'],
      `screenshot-${process.hrtime.bigint()}.png`);

    await screenshot({
       path: screenshotFilePath,
        fullPage: true
    });
    return path.basename(screenshotFilePath);
};

step("Kattints a <selector> r??di??gombra", async function(selector) {
    selector = utils.transformSelector(selector);
    await click(radioButton(selector));
});

step("Kattints a <selector> r??di??gombra ??s a <txt> c??mke legyen mellette", async function(selector, txt) {
    selector = utils.transformSelector(selector);
    await click(radioButton(selector, below(txt)));
});

step("Kattints a <selector> checkboxra", async function(selector) {
    selector = utils.transformSelector(selector);
    await click(checkBox(selector));
});

step("V??rj, hogy a <text> sz??veg megjelenjen", async (text) => {
    await waitFor(async () => !(await $(text).exists()));
});

step("V??rj <time> m??sodpercet", async (time) => {
    await waitFor(time * 1000);
});

step([
    "V??lt??s a <browserName> b??ng??sz?? lapra",
    "V??lt??s az <browserName> b??ng??sz?? lapra"
], async function(browserName) {
    await switchTo(browserName);
});

step([
        "Kattints a <tableId> t??bl??zat <rowId>. sor <columnId>. oszlop??ra",
        "Kattints az <tableId> t??bl??zat <rowId>. sor <columnId>. oszlop??ra"
    ],
    async function(tableId, rowId, columnId) {
        let cell = tableCell({row: rowId, col: columnId}, tableId);
        assert.ok(await cell.exists(), "Nem tal??lhat?? a t??bl??zat cella!");

        await click(cell);
});

step([
    "Kattints a <anchor> elemt??l balra l??v?? <selector> elemre",
    "Kattints az <anchor> elemt??l balra l??v?? <selector> elemre",
],
async function(anchor, selector) {
    anchor = utils.universalSelector(anchor);
    selector = utils.universalSelector(selector);

    await click(selector, toLeftOf(anchor));
});

step([
    "Kattints a <anchor> elemt??l jobbra l??v?? <selector> elemre",
    "Kattints az <anchor> elemt??l jobbra l??v?? <selector> elemre",
],
async function(anchor, selector) {
    anchor = utils.universalSelector(anchor);
    selector = utils.universalSelector(selector);

    await click(selector, toRightOf(anchor));
});

step([
    "Kattints a <anchor> elem alatt l??v?? <selector> elemre",
    "Kattints az <anchor> elem alatt l??v?? <selector> elemre",
],
async function(anchor, selector) {
    anchor = utils.universalSelector(anchor);
    selector = utils.universalSelector(selector);

    await click(selector, below(anchor));
});

step([
    "Kattints a <anchor> elem felett l??v?? <selector> elemre",
    "Kattints az <anchor> elem felett l??v?? <selector> elemre",
],
async function(anchor, selector) {
    anchor = utils.universalSelector(anchor);
    selector = utils.universalSelector(selector);

    await click(selector, above(anchor));
});

step([
    "Kattints a <anchor> elem k??zel??ben l??v?? <selector> elemre",
    "Kattints az <anchor> elem k??zel??ben l??v?? <selector> elemre",
],
async function(anchor, selector) {
    anchor = utils.universalSelector(anchor);

    selector = utils.getEnv(selector);
    selector = utils.universalSelector(selector);

    if (typeof selector === 'string') {
        selector = text(new RegExp(selector));
    }

    await click(selector, near(anchor));
});

step([
    "Kattints a <anchor> elemt??l <offset> pixelre l??v?? <selector> elemre",
    "Kattints az <anchor> elemt??l <offset> pixelre l??v?? <selector> elemre",
],
async function(anchor, offset, selector) {
    anchor = utils.universalSelector(anchor);
    if (typeof anchor === 'string') {
        anchor = text(new RegExp(anchor));
    }

    selector = utils.getEnv(selector);
    selector = utils.universalSelector(selector);

    if (typeof selector === 'string') {
        selector = text(new RegExp(selector));
    }

    await click(selector, near(anchor, {offset: offset}));
});

step([
    "Kattints dupl??n a <tableId> t??bl??zat <rowId>. sor <columnId>. oszlop??ra",
    "Kattints dupl??n az <tableId> t??bl??zat <rowId>. sor <columnId>. oszlop??ra"
],
async function(tableId, rowId, columnId) {
    let cell = tableCell({row: rowId, col: columnId}, tableId);
        assert.ok(await cell.exists(), "Nem tal??lhat?? a t??bl??zat cella!");

    await doubleClick(cell);
});

step([
        "Emeld ki a <tableId> t??bl??zat <rowId>. sor <columnId>. oszlop??t",
        "Emeld ki az <tableId> t??bl??zat <rowId>. sor <columnId>. oszlop??t"
    ],
    async function(tableId, rowId, columnId) {
        let cell = tableCell({row: rowId, col: columnId}, tableId);
        assert.ok(await cell.exists(), "Nem tal??lhat?? a t??bl??zat cella!");

        await highlight(cell);
});

step([
        "Emeld ki a <selector> elemet",
        "Emeld ki az <selector> elemet"
    ],
    async function(selector) {
        await highlight($(selector));
});

step([
    "Emeld ki a <txt> sz??veget",
    "Emeld ki az <txt> sz??veget"
    ],
    async function(txt) {
        await highlight(text(txt));
});

step("Navig??lj az alkalmaz??shoz", async function() {
    let appURL = process.env.app_url.toString();
    utils.message(appURL);

    await goto(appURL, { waitForEvents: ['firstMeaningfulPaint'] } );
});

step([
        "Kattints a <selector> linkre, hogy a <fileName> nev?? f??jlt let??ltse ??s v??rj erre <timeout> m??sodpercet",
        "Kattints a <selector> linkre, hogy az <fileName> nev?? f??jlt let??ltse ??s v??rj erre <timeout> m??sodpercet",
        "Kattints az <selector> linkre, hogy a <fileName> nev?? f??jlt let??ltse ??s v??rj erre <timeout> m??sodpercet",
        "Kattints az <selector> linkre, hogy az <fileName> nev?? f??jlt let??ltse ??s v??rj erre <timeout> m??sodpercet",
    ]
, async function(selector, fileName, timeout) {
    let downloadPath = gauge.dataStore.scenarioStore.get('CHROMIUM_TEMP_PROFILE_PARENT_DIR');
    let downloadedFilePath = path.join(downloadPath, fileName);
    console.log(downloadedFilePath);

    try {
        await client().send('Page.setDownloadBehavior', {
            behavior: 'allow',
            downloadPath: downloadPath,
        });

        selector = utils.getEnv(selector);
        selector = utils.universalSelector(selector);

        if (typeof selector === 'string') {
            selector = text(new RegExp(selector));
        }

        await click(selector);

        // wait for download
        await sleep(timeout * 1000);
        
        assert.ok(fs.existsSync(downloadedFilePath))
    } catch (e) {
        throw e;
    } finally {
        if (fs.existsSync(downloadedFilePath)) {
            rimraf.sync(downloadedFilePath);
        }
    }
});

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

step("T??r??ld a <tag> c??mk??t", async function(tag) {
    tag = utils.getEnv(tag);
    await click($("//*[text()[contains(., '"+ tag +"')]][1]/following-sibling::td[9]/a[@class='grid_delete']"));
});

step([
        "Jegyezd meg a <selector> ??rt??k??t a <key> azonos??t??val",
        "Jegyezd meg a <selector> ??rt??k??t az <key> azonos??t??val",
        "Jegyezd meg az <selector> ??rt??k??t a <key> azonos??t??val",
        "Jegyezd meg az <selector> ??rt??k??t az <key> azonos??t??val",
    ],
    async function(selector, key) {
        selector  = utils.universalSelector(selector);
        let txt = await selector.text();
        utils.message(txt);

        gauge.dataStore.specStore.put(key, txt);
});

step([
    "Jegyezd meg a <value> ??rt??ket a <key> azonos??t??val",
    "Jegyezd meg a <value> ??rt??ket az <key> azonos??t??val",
    "Jegyezd meg az <value> ??rt??ket a <key> azonos??t??val",
    "Jegyezd meg az <value> ??rt??ket az <key> azonos??t??val",
],
async function(value, key) {
    value = utils.randomize(value);
    gauge.dataStore.specStore.put(key, value);
});

//acceptAlert
step('Fogadd el a b??ng??sz?? figyelmeztet??st', async () => {
    try {
        confirm(async () => {
            await accept();
        });
    } catch(error) {}

    try {
        alert(async () => {
            await accept();
        });
    } catch(error) {}

    try {
        prompt(async () => {
            await accept();
        });
    } catch(error) {}
});

step('Fogadd el a <message> sz??veggel rendelkez?? b??ng??sz?? figyelmeztet??st', async (message) => {
    try {
        confirm(message, async ({message}) => {
            await accept();
        });
    } catch(error) {}

    try {
        alert(message,async ({message}) => {
            await accept();
        });
    } catch(error) {}

    try {
        prompt(message,async ({message}) => {
            await accept();
        });
    } catch(error) {}
});

//back
step('Nyomj a b??ng??sz?? vissza gombj??ra', async () => {
    await goBack();
});

//check
step([
    'V??laszd ki a <checkBoxLabel> jel??l??n??gyzetet(checkbox)',
    'V??laszd ki az <checkBoxLabel> jel??l??n??gyzetet(checkbox)',
    'Pip??ld ki a <checkBoxLabel> jel??l??n??gyzetet(checkbox)',
    'Pip??ld ki az <checkBoxLabel> jel??l??n??gyzetet(checkbox)'
    ],
    async (checkBoxLabel) => {
        await checkBox(checkBoxLabel).check();
});
step([
    'V??laszd ki a <radioButtonLabel> v??laszt??gombot(radio button)',
    'V??laszd ki az <radioButtonLabel> v??laszt??gombot(radio button)'], async (radioButtonLabel) => {
    await radioButton(radioButtonLabel).check();
});

//clearText
step('T??r??ld a <selector> elem sz??veg??t', async (selector) => {
    await clear(textBox(selector));
});

step('T??r??ld a <selector> ID-val rendelekez?? elem sz??veg??t', async (selector) => {
    await clear(textBox({ id: selector }));
});

//click
step([
        'Kattints a <selector> elemre',
        'Kattints az <selector> elemre',
        'Kattints a <selector> gombra',
        'Kattints az <selector> gombra',
    ]
    , async (selector) => {
        selector = utils.getEnv(selector);
        selector = utils.universalSelector(selector);

        if (typeof selector === 'string') {
            selector = text(new RegExp(selector));
        }

        await click(selector, { waitForNavigation: true});
});

step([
    'Kattints a <selector> linkre',
    'Kattints az <selector> linkre',
]
, async (selector) => {
    selector = utils.getEnv(selector);
    selector = utils.universalSelector(selector);

    if (typeof selector === 'string') {
        selector = link(new RegExp(selector));
    }

    console.log(selector);
    await click(selector);
});
step([
    'Kattints a <anchor> alatti <selector> elemre',
    'Kattints az <anchor> alatti <selector> elemre',
    'Kattints a <anchor> alatti <selector> gombra',
    'Kattints az <anchor> alatti <selector> gombra',
]
, async (anchor, selector) => {
    anchor = utils.universalSelector(anchor);
    selector = utils.transformSelector(selector);

    await click(
        selector,
        {
            waitForNavigation: true
        },
     below(anchor));
});

step([
        'Kattints a <selector> elemre, ha tudsz',
        'Kattints az <selector> elemre, ha tudsz'
    ],
    { continueOnFailure: true },
    async (selector) => {
        try {
            if (selector.startsWith('//') ||
                selector.startsWith('.') ||
                selector.startsWith('#')) {
                selector = $(selector);
            }
        
            let oldRetryTimeout = getConfig('retryTimeout');
            setConfig({retryTimeout: 3000});
            await click(selector);
            setConfig({retryTimeout: oldRetryTimeout});
        } catch(error) {
        }
});

// clickImage
step([
    'Kattints a <selector> k??pre',
    'Kattints az <selector> k??pre'], async (selector) => {
    
    await click(image(selector));
});

// clickOffset -- not implementable in taiko

// closeBrowser
step('B??ng??sz?? bez??r??sa', async () => {
    await closeBrowser();
    destroyBrowserUserDir();
});

// closeWindowIndex -- not implementable in taiko

// closeWindowTitle, closeWindowUrl
step('<titleOrURL> felirat?? b??ng??sz?? bez??r??sa', async (titleOrURL) => {
    await closeTab(titleOrURL);
});

step('<tabSelector> tab bez??r??sa', async (tabSelector) => {
    let re = new RegExp(tabSelector);
    await closeTab(re);
});

// convertWebElementToTestObject -- azt j?? volna meg??rni

// deleteAllCookies
step('Az ??sszes s??ti(cookie) t??rl??se', async () => {
    await deleteCookies();
});

// deselectAllOption
// deselectOptionByIndex
// deselectOptionByLabel
// deselectOptionByValue

// disableSmartWait -- not implementable in taiko

// dismissAlert
step('B??ng??sz?? figyelmeztet??st utas??tsd el', async () => {
    alert(async ({message}) => {
        await dismiss();
    });
});

// doubleClick
step([
    'Kattints dupl??n a <selector> elemre',
    'Kattints dupl??n az <selector> elemre'], async (selector) => {
    if (selector.startsWith('//') ||
        selector.startsWith('.') ||
        selector.startsWith('#')) {
        selector = $(selector);
    }

    await doubleClick(selector);
});

// dragAndDropByOffset
step('Fogd meg a <draggable> elemet ??s ejtsd a <x>, <y> pontra', async (draggable, x, y) => {
    destination = {};
    if (x >= 0) {
        destination.left = x;
    } else {
        destination.right = x * -1;
    }

    if (y >= 0) {
        destination.down = y;
    } else {
        destination.up = y * -1;
    }

    await dragAndDrop($(draggable), destination);
});

// dragAndDropToObject
step("Fogd meg a <draggable> elemet ??s ejtsd a <dropable> elemre", async function(draggable, dropable) {
    await dragAndDrop($(draggable),into($(dropable)));
});

// enableSmartWait -- not implementable in taiko

// enhancedClick -- not want to implement this function

// executeJavaScript TODO: nem biztos hogy j?? ??gy
step("Futtasd ez a JS scriptet: <script>", async function(script) {
    await evaluate(() => {
        eval(script);
    });
});

// focus
step("F??kusz??lj a <selector> elemre", async function(selector) {
    await focus(selector);
});

// forward
step('Nyomj a b??ng??sz?? el??re gombj??ra', async () => {
    await goForward();
});

// TODO: getAlertText
// TODO: getAllLinksOnCurrentPage
// TODO: getAttribute
// TODO: getCSSValue
// TODO: getElementHeight
// TODO: getElementLeftPosition
// TODO: getElementWidth
// TODO: getNumberOfSelectedOption
// TODO: getNumberOfTotalOption
// TODO: getPageHeight
// TODO: getPageWidth
// TODO: getText
// TODO: getUrl
// TODO: getViewportHeight
// TODO: getViewportLeftPosition
// TODO: getViewportTopPosition
// TODO: getViewportWidth
// TODO: getWindowIndex
// TODO: getWindowTitle

// maximizeWindow -- this is browser starter flag

// TODO: modifyObjectProperty

// mouseOver
step('Vidd az egeret a <selector> elem f??l??', async (selector) => {
    selector = utils.universalSelector(selector);

    await hover(selector);
});

// mouseOverOffset
step('Vidd az egeret a <x>, <y> koordin??t??k f??l??', async (x, y) => {
    await mouseAction('move', { x:x, y:y });
});

// navigateToUrl
step('Navig??lj a <URL> c??mre', async (URL) => {
    await goto(URL);
});

// openBrowser
step('B??ng??sz?? megnyit??sa', async () => {
        await openBrowser();
});

// refresh
step('Friss??tsd az oldalt', async () => {
    await reload();
});

// TODO: removeObjectProperty

// rightClick
step('Jobb klikk az <selector> elemen', async (selector) => {
    await rightClick(selector);
});

// TODO: rightClickOffset

// scrollToElement
step('G??rgess a <selector> elemig', async (selector) => {
    selector = utils.getEnv(selector);

    await scrollTo(selector, { blockAlignment: 'center', inlineAlignment: 'center' });
});

// scrollToPosition -- not implementable in Taiko

// TODO: selectAllOption
// TODO: selectOptionByIndex

// selectOptionByLabel
step("V??laszd ki a <dropdownLabel> leg??rd??l?? list??b??l a <dropdownValue> c??mk??j?? elemet", async function(dropdownLabel, dropdownValue) {
    await dropDown(dropdownLabel).select(dropdownValue);
});

step("V??laszd ki a <dropdownId> ID-val rendelkez?? leg??rd??l?? list??b??l a <dropdownValue> c??mk??j?? elemet", async function(dropdownId, dropdownValue) {
    await dropDown({ id : dropdownId }).select(dropdownValue);
});

step("V??laszd ki a <selector> ??rt??kkel rendelkez?? leg??rd??l?? list??b??l a <dropdownValue> c??mk??j?? elemet", async function(selector, dropdownValue) {
    await dropDown({ selector }).select(dropdownValue);
});

// TODO: selectOptionByValue

// sendKeys
step([
    "Nyomd meg a <key> billenty??t a billenty??zeten",
    "Nyomd meg az <key> billenty??t a billenty??zeten",
    "Nyomd meg a <key> billenyt??ket a billenty??zeten",
    "Nyomd meg az <key> billenyt??ket a billenty??zeten"
    ],
    async (key) => {
        await press(key);
});

step([
    "Nyomd meg a <key1> ??s <key2> billenty??ket a billenty??zeten"
    ],
    async (key1,key2) => {
        await press(key1&&key2);
});

step("Nyomj egy Enter-t",async () => {
    await press('Enter');
});

// setAlertText
// setEncryptedText
// setMaskedText
// setText
step([
        "??rd ezt a sz??veget <text> a <selector> c??mk??vel rendelkez?? elembe",
        "??rd a <text> sz??veget a <selector> c??mk??vel rendelkez?? elembe",
        "??rd az <text> sz??veget a <selector> c??mk??vel rendelkez?? elembe",
        "??rd a <text> sz??veget az <selector> c??mk??vel rendelkez?? elembe",
        "??rd az <text> sz??veget az <selector> c??mk??vel rendelkez?? elembe",
        "??rd a <text> sz??veget a <selector> elembe",
        "??rd az <text> sz??veget a <selector> elembe",
        "??rd a <text> sz??veget az <selector> elembe",
        "??rd az <text> sz??veget az <selector> elembe",
    ],
    async (text, selector) => {
        text = utils.getEnv(text);
        selector = utils.getEnv(selector);
        selector = utils.transformSelector(selector);
        await write(
            text,
            into(textBox(selector)),
            { 
                waitForNavigation: false,
                waitForStart: 0,
                delay: 0
            }
        );
});

step([
    "??rd ezt a sz??veget <text> a <anchor> elem alatti <selector> c??mk??vel rendelkez?? elembe",
    "??rd ezt a sz??veget <text> az <anchor> elem alatti <selector> c??mk??vel rendelkez?? elembe",
],
async (text, anchor, selector) => {
    text = utils.getEnv(text);
    selector = utils.transformSelector(selector);
    await write(text, into(textBox(selector, below(anchor))), { waitForNavigation: false, waitForStart: 0 });
});

// setViewPortSize
// submit
// switchToDefaultContent
// switchToFrame
// switchToWindowIndex
// switchToWindowTitle
// switchToWindowUrl
// takeAreaScreenshot
// takeAreaScreenshotAsCheckpoint
// takeElementScreenshot
// takeElementScreenshotAsCheckpoint
// takeFullPageScreenshot
// takeFullPageScreenshotAsCheckpoint
// takeScreenshot
// takeScreenshotAsCheckpoint
// typeOnImage
// uncheck
// uploadFile
step([
    "<fileNames> f??jl felt??lt??se a <fileSelector> mez??n kereszt??l"
],
async function(fileNames, fileSelector) {
    let selector = utils.transformSelector(fileSelector);
    
    fileNames = fileNames.split(',');
    fileNames.forEach(function (fileName, index) {
        fileNames[index] = path.join(__dirname, '..', 'test_files', fileName)
    });
    
    console.log(fileNames);
    await attach(fileNames, fileField(selector), { force: true });
});
// uploadFileWithDragAndDrop
// verifyAlertNotPresent
// verifyAlertPresent
// verifyAllLinksOnCurrentPageAccessible
// verifyElementAttributeValue
// verifyElementChecked
// verifyElementClickable
// verifyElementHasAttribute
// verifyElementInViewport
// verifyElementNotChecked
// verifyElementNotClickable
// verifyElementNotHasAttribute
// verifyElementNotInViewport
// verifyElementNotPresent
// verifyElementNotVisible
// verifyElementNotVisibleInViewport
// verifyElementPresent
// verifyElementText
// verifyElementVisible
// verifyElementVisibleInViewport
// verifyImagePresent
// verifyLinksAccessible

// verifyOptionNotPresentByLabel
step([
    'Ellen??rizd le, hogy a <dropDownId> <optionLabel> l??tezik-e',
    'Ellen??rizd le, hogy az <dropDownId> <optionLabel> l??tezik-e',
    ],
    async function(dropDownId, optionLabel) {
        dropDownId = utils.transformSelector(dropDownId);
        var result = await dropDown(dropDownId).select(optionLabel);
        utils.message(result);
});

// verifyOptionNotPresentByValue
// verifyOptionNotSelectedByIndex
// verifyOptionNotSelectedByLabel
// verifyOptionNotSelectedByValue
// verifyOptionPresentByLabel
// verifyOptionPresentByValue
// verifyOptionSelectedByIndex
// verifyOptionSelectedByLabel
// verifyOptionSelectedByValue
// verifyOptionsPresent

// verifyTextNotPresent
step([
        "Ellen??rizd le, hogy a <txt> sz??veg nem tal??lhat?? meg az oldalon",
        "Ellen??rizd le, hogy az <txt> sz??veg nem tal??lhat?? meg az oldalon"
    ],
    async function(txt) {
        txt = utils.getEnv(txt);
        assert.ok(!await text(txt).exists(1000, 1100));
});

// verifyTextPresent
step([
        "Ellen??rizd le, hogy a <txt> sz??veg megtal??lhat?? az oldalon",
        "Ellen??rizd le, hogy az <txt> sz??veg megtal??lhat?? az oldalon"
    ],
    async function(txt) {
        txt = utils.getEnv(txt);
        utils.message(txt);

        assert.ok(await text(txt).exists());
});


step("Ellen??rizd le, hogy pontosan a <text> sz??veg megtal??lhat?? az oldalon", async function(txt) {
    txt = utils.getEnv(txt);
    utils.message(txt);

    assert.ok(await text(txt, { exactMatch: true }).exists());
});

// waitForAlert
// waitForAngularLoad
// waitForElementAttributeValue
// waitForElementClickable
// waitForElementHasAttribute
// waitForElementNotClickable
// waitForElementNotHasAttribute

// waitForElementNotPresent
step([
    "V??rj, am??g a <txt> sz??veg nem lesz jelen",
    "V??rj, am??g az <txt> sz??veg nem lesz jelen",
    ],
    async function(txt) {
        txt = utils.getEnv(txt);
        await waitFor(async ()=> !(await text(txt).exists()), waitForTimeout);
});

// waitForElementNotVisible
step([
        "V??rj, am??g a <txt> sz??veg m??r nem l??tszik",
        "V??rj, am??g az <txt> sz??veg m??r nem l??tszik",
    ],
    async function(txt) {
        await waitFor(async ()=> !(await text(txt).isVisible()), waitForTimeout);
});

// waitForElementPresent
step([
        "V??rj, am??g a <txt> sz??veg jelen lesz",
        "V??rj, am??g az <txt> sz??veg jelen lesz"
    ],
    async function(txt) {
        txt = utils.getEnv(txt);
        await waitFor(async ()=> await text(txt).exists(), waitForTimeout);
});

step([
    "V??rj, am??g a <selector> elem jelen lesz",
    "V??rj, am??g az <selector> elem jelen lesz",
],
async function(selector) {
    selector = utils.universalSelector(selector);
    await waitFor(async ()=> await selector.exists(), waitForTimeout);
});

step([
    "V??rj, am??g a <selector> elem m??r nem lesz jelen",
    "V??rj, am??g az <selector> elem m??r nem lesz jelen",
],
async function(selector) {
    selector = utils.universalSelector(selector);
    await waitFor(async ()=> !(await selector.exists()), waitForTimeout);
});

// waitForElementVisible
step([
    "V??rj, am??g a <selector> elem l??tszik",
    "V??rj, am??g az <selector> elem l??tszik",
],
async function(selector) {
    selector = utils.getEnv(selector);
    selector = utils.universalSelector(selector);
    
    if (typeof selector === 'string') {
        selector = text(selector);
    }

    await waitFor(async ()=> await selector.isVisible(), waitForTimeout);
});

step([
    "V??rj, am??g a <selector> elem m??r nem l??tszik",
    "V??rj, am??g az <selector> elem m??r nem l??tszik",
],
async function(selector) {
    selector = utils.universalSelector(selector);
    await waitFor(async ()=> !(await selector.isVisible(), waitForTimeout));
});

step([
        "V??rj, am??g a <txt> sz??veg l??tszik",
        "V??rj, am??g az <txt> sz??veg l??tszik",
    ], async function(txt) {
        txt = utils.getEnv(txt);
        await waitFor(async ()=> await text(txt).isVisible(), waitForTimeout);
});

step([
    "V??rj, am??g a <regexp> regexp l??tszik",
    "V??rj, am??g az <regexp> regexp l??tszik",
], async function(regexp) {
    regexp = new RegExp(regexp);
    await waitFor(async ()=> await text(regexp).isVisible(), waitForTimeout);
});

step([
    "V??rj, am??g a <regexp> regexp m??r nem l??tszik",
    "V??rj, am??g az <regexp> regexp m??r nem l??tszik",
], async function(regexp) {
    regexp = new RegExp(regexp);
    await waitFor(async ()=> !await text(regexp).isVisible(), waitForTimeout);
});

// waitForImagePresent
// waitForJQueryLoad
// waitForPageLoad

//authenticate

step([
        "Ellen??rizd le, hogy a <selector> <paramName> param??ter??nek az ??rt??ke <value>",
        "Ellen??rizd le, hogy az <selector> <paramName> param??ter??nek az ??rt??ke <value>"
    ],
    async function(selector, paramName, value) {
        selector = utils.universalSelector(selector);
        if (typeof selector === 'string') {
            selector = utils.getEnv(selector);
            selector = await $(`//*[text()[contains(., '${selector}')]]`);
        }

        assert.strictEqual(await selector.attribute(paramName), value);
});
