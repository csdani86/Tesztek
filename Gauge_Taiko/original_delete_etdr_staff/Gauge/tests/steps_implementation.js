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

step("Kattints a <selector> rádiógombra", async function(selector) {
    selector = utils.transformSelector(selector);
    await click(radioButton(selector));
});

step("Kattints a <selector> rádiógombra és a <txt> címke legyen mellette", async function(selector, txt) {
    selector = utils.transformSelector(selector);
    await click(radioButton(selector, below(txt)));
});

step("Kattints a <selector> checkboxra", async function(selector) {
    selector = utils.transformSelector(selector);
    await click(checkBox(selector));
});

step("Várj, hogy a <text> szöveg megjelenjen", async (text) => {
    await waitFor(async () => !(await $(text).exists()));
});

step("Várj <time> másodpercet", async (time) => {
    await waitFor(time * 1000);
});

step([
    "Váltás a <browserName> böngésző lapra",
    "Váltás az <browserName> böngésző lapra"
], async function(browserName) {
    await switchTo(browserName);
});

step([
        "Kattints a <tableId> táblázat <rowId>. sor <columnId>. oszlopára",
        "Kattints az <tableId> táblázat <rowId>. sor <columnId>. oszlopára"
    ],
    async function(tableId, rowId, columnId) {
        let cell = tableCell({row: rowId, col: columnId}, tableId);
        assert.ok(await cell.exists(), "Nem található a táblázat cella!");

        await click(cell);
});

step([
    "Kattints a <anchor> elemtől balra lévő <selector> elemre",
    "Kattints az <anchor> elemtől balra lévő <selector> elemre",
],
async function(anchor, selector) {
    anchor = utils.universalSelector(anchor);
    selector = utils.universalSelector(selector);

    await click(selector, toLeftOf(anchor));
});

step([
    "Kattints a <anchor> elemtől jobbra lévő <selector> elemre",
    "Kattints az <anchor> elemtől jobbra lévő <selector> elemre",
],
async function(anchor, selector) {
    anchor = utils.universalSelector(anchor);
    selector = utils.universalSelector(selector);

    await click(selector, toRightOf(anchor));
});

step([
    "Kattints a <anchor> elem alatt lévő <selector> elemre",
    "Kattints az <anchor> elem alatt lévő <selector> elemre",
],
async function(anchor, selector) {
    anchor = utils.universalSelector(anchor);
    selector = utils.universalSelector(selector);

    await click(selector, below(anchor));
});

step([
    "Kattints a <anchor> elem felett lévő <selector> elemre",
    "Kattints az <anchor> elem felett lévő <selector> elemre",
],
async function(anchor, selector) {
    anchor = utils.universalSelector(anchor);
    selector = utils.universalSelector(selector);

    await click(selector, above(anchor));
});

step([
    "Kattints a <anchor> elem közelében lévő <selector> elemre",
    "Kattints az <anchor> elem közelében lévő <selector> elemre",
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
    "Kattints a <anchor> elemtől <offset> pixelre lévő <selector> elemre",
    "Kattints az <anchor> elemtől <offset> pixelre lévő <selector> elemre",
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
    "Kattints duplán a <tableId> táblázat <rowId>. sor <columnId>. oszlopára",
    "Kattints duplán az <tableId> táblázat <rowId>. sor <columnId>. oszlopára"
],
async function(tableId, rowId, columnId) {
    let cell = tableCell({row: rowId, col: columnId}, tableId);
        assert.ok(await cell.exists(), "Nem található a táblázat cella!");

    await doubleClick(cell);
});

step([
        "Emeld ki a <tableId> táblázat <rowId>. sor <columnId>. oszlopát",
        "Emeld ki az <tableId> táblázat <rowId>. sor <columnId>. oszlopát"
    ],
    async function(tableId, rowId, columnId) {
        let cell = tableCell({row: rowId, col: columnId}, tableId);
        assert.ok(await cell.exists(), "Nem található a táblázat cella!");

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
    "Emeld ki a <txt> szöveget",
    "Emeld ki az <txt> szöveget"
    ],
    async function(txt) {
        await highlight(text(txt));
});

step("Navigálj az alkalmazáshoz", async function() {
    let appURL = process.env.app_url.toString();
    utils.message(appURL);

    await goto(appURL, { waitForEvents: ['firstMeaningfulPaint'] } );
});

step([
        "Kattints a <selector> linkre, hogy a <fileName> nevű fájlt letöltse és várj erre <timeout> másodpercet",
        "Kattints a <selector> linkre, hogy az <fileName> nevű fájlt letöltse és várj erre <timeout> másodpercet",
        "Kattints az <selector> linkre, hogy a <fileName> nevű fájlt letöltse és várj erre <timeout> másodpercet",
        "Kattints az <selector> linkre, hogy az <fileName> nevű fájlt letöltse és várj erre <timeout> másodpercet",
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

step("Töröld a <tag> címkét", async function(tag) {
    tag = utils.getEnv(tag);
    await click($("//*[text()[contains(., '"+ tag +"')]][1]/following-sibling::td[9]/a[@class='grid_delete']"));
});

step([
        "Jegyezd meg a <selector> értékét a <key> azonosítóval",
        "Jegyezd meg a <selector> értékét az <key> azonosítóval",
        "Jegyezd meg az <selector> értékét a <key> azonosítóval",
        "Jegyezd meg az <selector> értékét az <key> azonosítóval",
    ],
    async function(selector, key) {
        selector  = utils.universalSelector(selector);
        let txt = await selector.text();
        utils.message(txt);

        gauge.dataStore.specStore.put(key, txt);
});

step([
    "Jegyezd meg a <value> értéket a <key> azonosítóval",
    "Jegyezd meg a <value> értéket az <key> azonosítóval",
    "Jegyezd meg az <value> értéket a <key> azonosítóval",
    "Jegyezd meg az <value> értéket az <key> azonosítóval",
],
async function(value, key) {
    value = utils.randomize(value);
    gauge.dataStore.specStore.put(key, value);
});

//acceptAlert
step('Fogadd el a böngésző figyelmeztetést', async () => {
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

step('Fogadd el a <message> szöveggel rendelkező böngésző figyelmeztetést', async (message) => {
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
step('Nyomj a böngésző vissza gombjára', async () => {
    await goBack();
});

//check
step([
    'Válaszd ki a <checkBoxLabel> jelölőnégyzetet(checkbox)',
    'Válaszd ki az <checkBoxLabel> jelölőnégyzetet(checkbox)',
    'Pipáld ki a <checkBoxLabel> jelölőnégyzetet(checkbox)',
    'Pipáld ki az <checkBoxLabel> jelölőnégyzetet(checkbox)'
    ],
    async (checkBoxLabel) => {
        await checkBox(checkBoxLabel).check();
});
step([
    'Válaszd ki a <radioButtonLabel> választógombot(radio button)',
    'Válaszd ki az <radioButtonLabel> választógombot(radio button)'], async (radioButtonLabel) => {
    await radioButton(radioButtonLabel).check();
});

//clearText
step('Töröld a <selector> elem szövegét', async (selector) => {
    await clear(textBox(selector));
});

step('Töröld a <selector> ID-val rendelekező elem szövegét', async (selector) => {
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
    'Kattints a <selector> képre',
    'Kattints az <selector> képre'], async (selector) => {
    
    await click(image(selector));
});

// clickOffset -- not implementable in taiko

// closeBrowser
step('Böngésző bezárása', async () => {
    await closeBrowser();
    destroyBrowserUserDir();
});

// closeWindowIndex -- not implementable in taiko

// closeWindowTitle, closeWindowUrl
step('<titleOrURL> feliratú böngésző bezárása', async (titleOrURL) => {
    await closeTab(titleOrURL);
});

step('<tabSelector> tab bezárása', async (tabSelector) => {
    let re = new RegExp(tabSelector);
    await closeTab(re);
});

// convertWebElementToTestObject -- azt jó volna megírni

// deleteAllCookies
step('Az összes süti(cookie) törlése', async () => {
    await deleteCookies();
});

// deselectAllOption
// deselectOptionByIndex
// deselectOptionByLabel
// deselectOptionByValue

// disableSmartWait -- not implementable in taiko

// dismissAlert
step('Böngésző figyelmeztetést utasítsd el', async () => {
    alert(async ({message}) => {
        await dismiss();
    });
});

// doubleClick
step([
    'Kattints duplán a <selector> elemre',
    'Kattints duplán az <selector> elemre'], async (selector) => {
    if (selector.startsWith('//') ||
        selector.startsWith('.') ||
        selector.startsWith('#')) {
        selector = $(selector);
    }

    await doubleClick(selector);
});

// dragAndDropByOffset
step('Fogd meg a <draggable> elemet és ejtsd a <x>, <y> pontra', async (draggable, x, y) => {
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
step("Fogd meg a <draggable> elemet és ejtsd a <dropable> elemre", async function(draggable, dropable) {
    await dragAndDrop($(draggable),into($(dropable)));
});

// enableSmartWait -- not implementable in taiko

// enhancedClick -- not want to implement this function

// executeJavaScript TODO: nem biztos hogy jó így
step("Futtasd ez a JS scriptet: <script>", async function(script) {
    await evaluate(() => {
        eval(script);
    });
});

// focus
step("Fókuszálj a <selector> elemre", async function(selector) {
    await focus(selector);
});

// forward
step('Nyomj a böngésző előre gombjára', async () => {
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
step('Vidd az egeret a <selector> elem fölé', async (selector) => {
    selector = utils.universalSelector(selector);

    await hover(selector);
});

// mouseOverOffset
step('Vidd az egeret a <x>, <y> koordináták fölé', async (x, y) => {
    await mouseAction('move', { x:x, y:y });
});

// navigateToUrl
step('Navigálj a <URL> címre', async (URL) => {
    await goto(URL);
});

// openBrowser
step('Böngésző megnyitása', async () => {
        await openBrowser();
});

// refresh
step('Frissítsd az oldalt', async () => {
    await reload();
});

// TODO: removeObjectProperty

// rightClick
step('Jobb klikk az <selector> elemen', async (selector) => {
    await rightClick(selector);
});

// TODO: rightClickOffset

// scrollToElement
step('Görgess a <selector> elemig', async (selector) => {
    selector = utils.getEnv(selector);

    await scrollTo(selector, { blockAlignment: 'center', inlineAlignment: 'center' });
});

// scrollToPosition -- not implementable in Taiko

// TODO: selectAllOption
// TODO: selectOptionByIndex

// selectOptionByLabel
step("Válaszd ki a <dropdownLabel> legördülő listából a <dropdownValue> címkéjű elemet", async function(dropdownLabel, dropdownValue) {
    await dropDown(dropdownLabel).select(dropdownValue);
});

step("Válaszd ki a <dropdownId> ID-val rendelkező legördülő listából a <dropdownValue> címkéjű elemet", async function(dropdownId, dropdownValue) {
    await dropDown({ id : dropdownId }).select(dropdownValue);
});

step("Válaszd ki a <selector> értékkel rendelkező legördülő listából a <dropdownValue> címkéjű elemet", async function(selector, dropdownValue) {
    await dropDown({ selector }).select(dropdownValue);
});

// TODO: selectOptionByValue

// sendKeys
step([
    "Nyomd meg a <key> billentyűt a billentyűzeten",
    "Nyomd meg az <key> billentyűt a billentyűzeten",
    "Nyomd meg a <key> billenytűket a billentyűzeten",
    "Nyomd meg az <key> billenytűket a billentyűzeten"
    ],
    async (key) => {
        await press(key);
});

step([
    "Nyomd meg a <key1> és <key2> billentyűket a billentyűzeten"
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
        "Írd ezt a szöveget <text> a <selector> címkével rendelkező elembe",
        "Írd a <text> szöveget a <selector> címkével rendelkező elembe",
        "Írd az <text> szöveget a <selector> címkével rendelkező elembe",
        "Írd a <text> szöveget az <selector> címkével rendelkező elembe",
        "Írd az <text> szöveget az <selector> címkével rendelkező elembe",
        "Írd a <text> szöveget a <selector> elembe",
        "Írd az <text> szöveget a <selector> elembe",
        "Írd a <text> szöveget az <selector> elembe",
        "Írd az <text> szöveget az <selector> elembe",
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
    "Írd ezt a szöveget <text> a <anchor> elem alatti <selector> címkével rendelkező elembe",
    "Írd ezt a szöveget <text> az <anchor> elem alatti <selector> címkével rendelkező elembe",
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
    "<fileNames> fájl feltöltése a <fileSelector> mezőn keresztül"
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
    'Ellenőrizd le, hogy a <dropDownId> <optionLabel> létezik-e',
    'Ellenőrizd le, hogy az <dropDownId> <optionLabel> létezik-e',
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
        "Ellenőrizd le, hogy a <txt> szöveg nem található meg az oldalon",
        "Ellenőrizd le, hogy az <txt> szöveg nem található meg az oldalon"
    ],
    async function(txt) {
        txt = utils.getEnv(txt);
        assert.ok(!await text(txt).exists(1000, 1100));
});

// verifyTextPresent
step([
        "Ellenőrizd le, hogy a <txt> szöveg megtalálható az oldalon",
        "Ellenőrizd le, hogy az <txt> szöveg megtalálható az oldalon"
    ],
    async function(txt) {
        txt = utils.getEnv(txt);
        utils.message(txt);

        assert.ok(await text(txt).exists());
});


step("Ellenőrizd le, hogy pontosan a <text> szöveg megtalálható az oldalon", async function(txt) {
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
    "Várj, amíg a <txt> szöveg nem lesz jelen",
    "Várj, amíg az <txt> szöveg nem lesz jelen",
    ],
    async function(txt) {
        txt = utils.getEnv(txt);
        await waitFor(async ()=> !(await text(txt).exists()), waitForTimeout);
});

// waitForElementNotVisible
step([
        "Várj, amíg a <txt> szöveg már nem látszik",
        "Várj, amíg az <txt> szöveg már nem látszik",
    ],
    async function(txt) {
        await waitFor(async ()=> !(await text(txt).isVisible()), waitForTimeout);
});

// waitForElementPresent
step([
        "Várj, amíg a <txt> szöveg jelen lesz",
        "Várj, amíg az <txt> szöveg jelen lesz"
    ],
    async function(txt) {
        txt = utils.getEnv(txt);
        await waitFor(async ()=> await text(txt).exists(), waitForTimeout);
});

step([
    "Várj, amíg a <selector> elem jelen lesz",
    "Várj, amíg az <selector> elem jelen lesz",
],
async function(selector) {
    selector = utils.universalSelector(selector);
    await waitFor(async ()=> await selector.exists(), waitForTimeout);
});

step([
    "Várj, amíg a <selector> elem már nem lesz jelen",
    "Várj, amíg az <selector> elem már nem lesz jelen",
],
async function(selector) {
    selector = utils.universalSelector(selector);
    await waitFor(async ()=> !(await selector.exists()), waitForTimeout);
});

// waitForElementVisible
step([
    "Várj, amíg a <selector> elem látszik",
    "Várj, amíg az <selector> elem látszik",
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
    "Várj, amíg a <selector> elem már nem látszik",
    "Várj, amíg az <selector> elem már nem látszik",
],
async function(selector) {
    selector = utils.universalSelector(selector);
    await waitFor(async ()=> !(await selector.isVisible(), waitForTimeout));
});

step([
        "Várj, amíg a <txt> szöveg látszik",
        "Várj, amíg az <txt> szöveg látszik",
    ], async function(txt) {
        txt = utils.getEnv(txt);
        await waitFor(async ()=> await text(txt).isVisible(), waitForTimeout);
});

step([
    "Várj, amíg a <regexp> regexp látszik",
    "Várj, amíg az <regexp> regexp látszik",
], async function(regexp) {
    regexp = new RegExp(regexp);
    await waitFor(async ()=> await text(regexp).isVisible(), waitForTimeout);
});

step([
    "Várj, amíg a <regexp> regexp már nem látszik",
    "Várj, amíg az <regexp> regexp már nem látszik",
], async function(regexp) {
    regexp = new RegExp(regexp);
    await waitFor(async ()=> !await text(regexp).isVisible(), waitForTimeout);
});

// waitForImagePresent
// waitForJQueryLoad
// waitForPageLoad

//authenticate

step([
        "Ellenőrizd le, hogy a <selector> <paramName> paraméterének az értéke <value>",
        "Ellenőrizd le, hogy az <selector> <paramName> paraméterének az értéke <value>"
    ],
    async function(selector, paramName, value) {
        selector = utils.universalSelector(selector);
        if (typeof selector === 'string') {
            selector = utils.getEnv(selector);
            selector = await $(`//*[text()[contains(., '${selector}')]]`);
        }

        assert.strictEqual(await selector.attribute(paramName), value);
});
