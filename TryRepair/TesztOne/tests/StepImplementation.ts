import * as path from "path";
import * as randomstring from "randomstring";
import { expect } from "@playwright/test";
import {
    Browser,
    BrowserContext,
    chromium,
    firefox,
    webkit,
    Page,
    PageScreenshotOptions,
    BrowserContextOptions,
} from "playwright";
import {
    AfterSuite,
    BeforeSuite,
    ContinueOnFailure,
    CustomScreenshotWriter,
    DataStore,
    DataStoreFactory,
    Gauge,
    Step,
    Table,
} from "gauge-ts";
import { trace } from "console";

let isTracing: boolean = true;
let currentPage: Page;
let browser: Browser;
let browserHistory: Page[] = [];
let browserCtx: BrowserContext;
let browserCtxOptions: BrowserContextOptions = {
    strictSelectors: true,
    screen: {
        width: 1284,
        height: 720
    },
    viewport: {
        width: 1284,
        height: 720
    },
    /*recordVideo: {
        dir: './videos/'
    }*/
};


export default class StepImplementation {

    @BeforeSuite()
    public async beforeSuite() {
        browser = await chromium.launch({ headless: false });
        browserCtx = await browser.newContext(browserCtxOptions);
        currentPage = await browserCtx.newPage();

        // Tracing
        if (isTracing) {
            browserCtx.tracing.start({
                screenshots: true,
                snapshots: true,
            });
        }

        // event liseners
        browserCtx.on("page", async (newPage) => this.newPage(newPage));
        browserCtx.on("close", async () => this.closePage());
    }

    private async newPage(newPage: Page) {
        browserHistory.push(currentPage);
        currentPage = newPage;

        currentPage.on('dialog', async dialog => {
            Gauge.writeMessage(dialog.message());

            await dialog.accept();
        });
    }

    private async closePage() {
        if (browserHistory.length > 1) {
            currentPage = browserHistory.pop();
        }
        else {
            browser.close();
        }
    }

    @AfterSuite()
    public async afterSuite() {
        if (isTracing) {
            await browserCtx.tracing.stop({
                path: 'trace.zip'
            });
        }
        await browser.close();
    }

    @CustomScreenshotWriter()
    public async customScreenshotWriter(): Promise<string> {
        const screenshotFilePath = path.join(
            process.env['gauge_screenshots_dir'],
            `screenshot-${process.hrtime.bigint()}.png`,
        ).replace("/", "\\");

        let options: PageScreenshotOptions = {
            path: screenshotFilePath,
            fullPage: true
        };

        await currentPage.screenshot(options);

        return path.basename(screenshotFilePath);
    }

    @Step("Navigálj az alkalmazáshoz")
    public async openApp() {
        let appURL = process.env.app_url.toString();
        Gauge.writeMessage(appURL);

        await currentPage.goto(appURL);
    }

    @Step("Nyomj egy Enter-t")
    public async pressEnterButton() {
        await currentPage.keyboard.press("Enter");
    }

    @Step("Nyomj egy Tab-ot")
    public async pressTabButton() {
        await currentPage.keyboard.press("Tab");
    }

    @Step([
        "Kattints a <selector> elemre",
        "Kattints az <selector> elemre",
        "Kattints a <selector> gombra",
        "Kattints az <selector> gombra",
        "Kattints a <selector> fülre",
        "Kattints az <selector> fülre",
    ])
    public async click(selector: string) {
        selector = this.resolvePlaceholder(selector);
        selector = this.selectorCorrection(selector);

        await currentPage.click(selector);
    }

    @Step([
        "Kattints a <selector> elemre, ha tudsz",
        "Kattints az <selector> elemre, ha tudsz",
        "Kattints a <selector> gombra, ha tudsz",
        "Kattints az <selector> gombra, ha tudsz",
    ])
    public async clickIfYouCan(selector: string) {
        selector = this.resolvePlaceholder(selector);
        selector = this.selectorCorrection(selector);

        try {
            await currentPage.click(selector, { timeout: 5000 });
        } catch (e) { }
    }

    @Step(
        [
            "Kattints a <tableId> táblázat <rowId>. sor <columnId>. oszlopára",
            "Kattints az <tableId> táblázat <rowId>. sor <columnId>. oszlopára",
        ])
    public async clickTableCell(tableId: string, rowId: string, columnId: string) {
        await currentPage.click(`${tableId} tr:nth-child(${rowId}) td:nth-child(${columnId}) >> visible=true`);
    }

    @Step(
        [
            "Válaszd ki a <dropdownLabel> legördülő listából a <dropdownValue> címkéjű elemet",
            "Válaszd ki a <dropdownLabel> legördülő listából az <dropdownValue> címkéjű elemet",
            "Válaszd ki az <dropdownLabel> legördülő listából az <dropdownValue> címkéjű elemet",
            "Válaszd ki az <dropdownLabel> legördülő listából a <dropdownValue> címkéjű elemet",
        ])
    public async selectElementByLabel(selector: string, dropdownValue: string) {
        selector = this.resolvePlaceholder(selector);
        selector = this.selectorCorrection(selector);
        dropdownValue = this.resolvePlaceholder(dropdownValue);

        await currentPage.selectOption(selector, { label: dropdownValue });
    }

    @Step(
        [
            "Válaszd ki a <checkBoxLabel> jelölőnégyzetet(checkbox)",
            "Válaszd ki az <checkBoxLabel> jelölőnégyzetet(checkbox)",
            "Pipáld ki a <checkBoxLabel> jelölőnégyzetet(checkbox)",
            "Pipáld ki az <checkBoxLabel> jelölőnégyzetet(checkbox)",
        ])
    public async checkByLabel(checkBoxLabel) {
        let checkBox = currentPage.locator(`label:has-text("${checkBoxLabel}") >> visible=true`);

        await checkBox.check();
    }

    @Step([
        "Várj, amíg a <selector> regexp látszik",
        "Várj, amíg az <selector> regexp látszik",
        "Várj, amíg a <selector> szöveg látszik",
        "Várj, amíg az <selector> szöveg látszik",
        "Várj, amíg a <selector> elem látszik",
        "Várj, amíg az <selector> elem látszik",
    ])
    public async waitForElementIsVisible(selector: string) {
        selector = this.resolvePlaceholder(selector);
        selector = this.selectorCorrection(selector);

        await currentPage.waitForSelector(selector, { state: "visible" });
    }

    @Step("Várj <seconds> másodpercet")
    public async waitForTime(seconds: number) {
        await currentPage.waitForTimeout(seconds * 1000);
    }

    @Step([
        "Várj, amíg a <selector> regexp már nem látszik",
        "Várj, amíg az <selector> regexp már nem látszik",
        "Várj, amíg a <selector> szöveg már nem látszik",
        "Várj, amíg az <selector> szöveg már nem látszik",
        "Várj, amíg a <selector> elem már nem látszik",
        "Várj, amíg az <selector> elem már nem látszik",
    ])
    public async waitForElementIsNotVisible(selector: string) {
        selector = this.resolvePlaceholder(selector);
        selector = this.selectorCorrection(selector);

        await currentPage.waitForSelector(selector, { state: "hidden" });
    }

    @Step([
        "Várj, amíg a <selector> regexp jelen lesz",
        "Várj, amíg az <selector> regexp jelen lesz",
        "Várj, amíg a <selector> szöveg jelen lesz",
        "Várj, amíg az <selector> szöveg jelen lesz",
        "Várj, amíg a <selector> elem jelen lesz",
        "Várj, amíg az <selector> elem jelen lesz",
        "Várj, hogy a <selector> szöveg megjelenjen",
        "Várj, hogy az <selector> szöveg megjelenjen",
    ])
    public async waitForElementIsExists(selector: string) {
        selector = this.resolvePlaceholder(selector);
        selector = this.selectorCorrection(selector);

        await currentPage.waitForSelector(selector, { state: "attached" });
    }

    @Step([
        "Ellenőrizd le, hogy a <text> szöveg megtalálható az oldalon",
        "Ellenőrizd le, hogy az <text> szöveg megtalálható az oldalon"
    ])
    public async isTextOnThePage(text: string) {
        text = this.resolvePlaceholder(text);
        let selector = `xpath=//*[text()[contains(. ,'${text}')]]`;

        await currentPage.isVisible(selector);
    }

    @Step([
        "Várj, amíg a <selector> regexp nem lesz jelen",
        "Várj, amíg az <selector> regexp nem lesz jelen",
        "Várj, amíg a <selector> szöveg nem lesz jelen",
        "Várj, amíg az <selector> szöveg nem lesz jelen",
        "Várj, amíg a <selector> elem nem lesz jelen",
        "Várj, amíg az <selector> elem nem lesz jelen",
        "Várj, amíg a <selector> elem már nem lesz jelen",
        "Várj, amíg az <selector> elem már nem lesz jelen",
    ])
    public async waitForElementIsNotExists(selector: string) {
        selector = this.resolvePlaceholder(selector);
        selector = this.selectorCorrection(selector);

        await currentPage.waitForSelector(selector, { state: "detached" });
    }

    @Step(
        [
            "Jegyezd meg a <selector> értékét a <key> azonosítóval",
            "Jegyezd meg a <selector> értékét az <key> azonosítóval",
            "Jegyezd meg az <selector> értékét a <key> azonosítóval",
            "Jegyezd meg az <selector> értékét az <key> azonosítóval",
        ])
    public async storeSelectedValueIncache(selector: string, key: string) {
        selector = this.resolvePlaceholder(selector);
        selector = this.selectorCorrection(selector);
        let txt = await currentPage.locator(selector).textContent();
        Gauge.writeMessage(txt);

        let specStore: DataStore = DataStoreFactory.getSpecDataStore();
        specStore.put(key, txt);
    }

    @Step(
        [
            "Jegyezd meg a <value> értéket a <key> azonosítóval",
            "Jegyezd meg a <value> értéket az <key> azonosítóval",
            "Jegyezd meg az <value> értéket a <key> azonosítóval",
            "Jegyezd meg az <value> értéket az <key> azonosítóval",
        ])
    public async storeValueIncache(value: string, key: string) {
        value = this.resolvePlaceholder(value);
        Gauge.writeMessage(value);

        let specStore: DataStore = DataStoreFactory.getSpecDataStore();
        specStore.put(key, value);
    }

    @Step([
        "Töröld a <selector> elem szövegét",
        "Töröld a <selector> ID-val rendelekező elem szövegét"
    ])
    public async deleteElementContent(selector: string) {
        selector = this.resolvePlaceholder(selector);
        selector = this.selectorCorrection(selector);

        await currentPage.fill(selector, '');
    }

    @Step([
        "<fileName> fájl feltöltése a <fileSelector> mezőn keresztül"
    ])
    public async fileUploadByInput(fileName: string, selector: string) {
        selector = this.resolvePlaceholder(selector);
        selector = this.selectorCorrection(selector, '');

        await currentPage.setInputFiles(
            selector,
            path.join(__dirname, "..", "test_files", fileName)
        );
    }

    @Step(
        [
            "Írd a <text> szöveget a <selector> elembe",
            "Írd az <text> szöveget a <selector> elembe",
            "Írd a <text> szöveget az <selector> elembe",
            "Írd az <text> szöveget az <selector> elembe",
            "Írd ezt a szöveget <text> a <selector> címkével rendelkező elembe",
            "Írd a <text> szöveget a <selector> címkével rendelkező elembe",
            "Írd az <text> szöveget a <selector> címkével rendelkező elembe",
            "Írd a <text> szöveget az <selector> címkével rendelkező elembe",
            "Írd az <text> szöveget az <selector> címkével rendelkező elembe",
        ])
    public async typeInput(text: string, selector: string) {
        text = this.resolvePlaceholder(text);
        selector = this.resolvePlaceholder(selector);
        selector = this.selectorCorrection(selector);

        await currentPage.type(selector, text);
    }

    @Step([
        "Ellenőrizd le, hogy a <selector> <paramName> paraméterének az értéke <value>",
        "Ellenőrizd le, hogy az <selector> <paramName> paraméterének az értéke <value>"
    ])
    public async CheckIfSelectedParamContentIs(selector: string, paramName: string, value: string) {
        selector = this.resolvePlaceholder(selector);
        selector = this.selectorCorrection(selector);

        const attributeValue = await currentPage.getAttribute(selector, paramName);
        expect(attributeValue).toBe(value);
    }

    @Step([
        "Ellenőrizd le, hogy a <text> szöveg nem található meg az oldalon",
        "Ellenőrizd le, hogy az <text> szöveg nem található meg az oldalon"
    ])
    public async CheckIfTextIsNotOnThePage(text: string) {
        text = this.resolvePlaceholder(text);

        await currentPage.waitForSelector(`text=${text}`, { state: 'detached' });
    }

    // TODO: to other module--------- Utils functions ---------
    private resolvePlaceholder(param: string) {
        if (param.startsWith("ENV:")) {
            param = this.getEnvironmentVariable(param);
        }

        if (param.startsWith("CACHE:")) {
            param = this.getCacheItem(param);
        }

        if (param.startsWith("RAND:")) {
            param = this.randimize(param);
        }

        return param;
    }

    private selectorCorrection(param: string, visible: string = '>> visible=true') {
        if (
            !param.startsWith('//')
            && !param.startsWith(".")
            && !param.startsWith("#")
            && !param.startsWith("css=")
            && !param.startsWith("xpath=")
            && !param.startsWith("text=")
        ) {
            param = 'text=' + param
        }

        return `${param} ${visible}`;
    }

    private getEnvironmentVariable(param: string) {
        let paramName = param.split(":")[1];
        param = process.env[paramName];

        Gauge.writeMessage("ENV: " + param);

        return param;
    }

    private getCacheItem(param) {
        let key = param.split(":")[1];

        let specStore: DataStore = DataStoreFactory.getSpecDataStore();
        param = specStore.get(key) as string;
        Gauge.writeMessage(key + ": " + param);

        return param;
    }

    private randimize(param) {
        let cs = param.split(":")[1];
        let l = param.split(":")[2];
        let isPrefix = param.split(":")[3];
        let prefixText = param.split(":")[4];

        param = randomstring.generate({
            charset: cs,
            length: l,
        });

        if (isPrefix = 'PREFIX') {
            param = prefixText + param;
        }

        Gauge.writeMessage(param);

        return param;
    }
}
