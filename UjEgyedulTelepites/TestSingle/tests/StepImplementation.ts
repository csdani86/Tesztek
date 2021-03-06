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

    @Step("Navig??lj az alkalmaz??shoz")
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
        "Kattints a <selector> f??lre",
        "Kattints az <selector> f??lre",
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
            "Kattints a <tableId> t??bl??zat <rowId>. sor <columnId>. oszlop??ra",
            "Kattints az <tableId> t??bl??zat <rowId>. sor <columnId>. oszlop??ra",
        ])
    public async clickTableCell(tableId: string, rowId: string, columnId: string) {
        await currentPage.click(`${tableId} tr:nth-child(${rowId}) td:nth-child(${columnId}) >> visible=true`);
    }

    @Step(
        [
            "V??laszd ki a <dropdownLabel> leg??rd??l?? list??b??l a <dropdownValue> c??mk??j?? elemet",
            "V??laszd ki a <dropdownLabel> leg??rd??l?? list??b??l az <dropdownValue> c??mk??j?? elemet",
            "V??laszd ki az <dropdownLabel> leg??rd??l?? list??b??l az <dropdownValue> c??mk??j?? elemet",
            "V??laszd ki az <dropdownLabel> leg??rd??l?? list??b??l a <dropdownValue> c??mk??j?? elemet",
        ])
    public async selectElementByLabel(selector: string, dropdownValue: string) {
        selector = this.resolvePlaceholder(selector);
        selector = this.selectorCorrection(selector);
        dropdownValue = this.resolvePlaceholder(dropdownValue);

        await currentPage.selectOption(selector, { label: dropdownValue });
    }

    @Step(
        [
            "V??laszd ki a <checkBoxLabel> jel??l??n??gyzetet(checkbox)",
            "V??laszd ki az <checkBoxLabel> jel??l??n??gyzetet(checkbox)",
            "Pip??ld ki a <checkBoxLabel> jel??l??n??gyzetet(checkbox)",
            "Pip??ld ki az <checkBoxLabel> jel??l??n??gyzetet(checkbox)",
        ])
    public async checkByLabel(checkBoxLabel) {
        let checkBox = currentPage.locator(`label:has-text("${checkBoxLabel}") >> visible=true`);

        await checkBox.check();
    }

    @Step([
        "V??rj, am??g a <selector> regexp l??tszik",
        "V??rj, am??g az <selector> regexp l??tszik",
        "V??rj, am??g a <selector> sz??veg l??tszik",
        "V??rj, am??g az <selector> sz??veg l??tszik",
        "V??rj, am??g a <selector> elem l??tszik",
        "V??rj, am??g az <selector> elem l??tszik",
    ])
    public async waitForElementIsVisible(selector: string) {
        selector = this.resolvePlaceholder(selector);
        selector = this.selectorCorrection(selector);

        await currentPage.waitForSelector(selector, { state: "visible" });
    }

    @Step("V??rj <seconds> m??sodpercet")
    public async waitForTime(seconds: number) {
        await currentPage.waitForTimeout(seconds * 1000);
    }

    @Step([
        "V??rj, am??g a <selector> regexp m??r nem l??tszik",
        "V??rj, am??g az <selector> regexp m??r nem l??tszik",
        "V??rj, am??g a <selector> sz??veg m??r nem l??tszik",
        "V??rj, am??g az <selector> sz??veg m??r nem l??tszik",
        "V??rj, am??g a <selector> elem m??r nem l??tszik",
        "V??rj, am??g az <selector> elem m??r nem l??tszik",
    ])
    public async waitForElementIsNotVisible(selector: string) {
        selector = this.resolvePlaceholder(selector);
        selector = this.selectorCorrection(selector);

        await currentPage.waitForSelector(selector, { state: "hidden" });
    }

    @Step([
        "V??rj, am??g a <selector> regexp jelen lesz",
        "V??rj, am??g az <selector> regexp jelen lesz",
        "V??rj, am??g a <selector> sz??veg jelen lesz",
        "V??rj, am??g az <selector> sz??veg jelen lesz",
        "V??rj, am??g a <selector> elem jelen lesz",
        "V??rj, am??g az <selector> elem jelen lesz",
        "V??rj, hogy a <selector> sz??veg megjelenjen",
        "V??rj, hogy az <selector> sz??veg megjelenjen",
    ])
    public async waitForElementIsExists(selector: string) {
        selector = this.resolvePlaceholder(selector);
        selector = this.selectorCorrection(selector);

        await currentPage.waitForSelector(selector, { state: "attached" });
    }

    @Step([
        "Ellen??rizd le, hogy a <text> sz??veg megtal??lhat?? az oldalon",
        "Ellen??rizd le, hogy az <text> sz??veg megtal??lhat?? az oldalon"
    ])
    public async isTextOnThePage(text: string) {
        text = this.resolvePlaceholder(text);
        let selector = `xpath=//*[text()[contains(. ,'${text}')]]`;

        await currentPage.isVisible(selector);
    }

    @Step([
        "V??rj, am??g a <selector> regexp nem lesz jelen",
        "V??rj, am??g az <selector> regexp nem lesz jelen",
        "V??rj, am??g a <selector> sz??veg nem lesz jelen",
        "V??rj, am??g az <selector> sz??veg nem lesz jelen",
        "V??rj, am??g a <selector> elem nem lesz jelen",
        "V??rj, am??g az <selector> elem nem lesz jelen",
        "V??rj, am??g a <selector> elem m??r nem lesz jelen",
        "V??rj, am??g az <selector> elem m??r nem lesz jelen",
    ])
    public async waitForElementIsNotExists(selector: string) {
        selector = this.resolvePlaceholder(selector);
        selector = this.selectorCorrection(selector);

        await currentPage.waitForSelector(selector, { state: "detached" });
    }

    @Step(
        [
            "Jegyezd meg a <selector> ??rt??k??t a <key> azonos??t??val",
            "Jegyezd meg a <selector> ??rt??k??t az <key> azonos??t??val",
            "Jegyezd meg az <selector> ??rt??k??t a <key> azonos??t??val",
            "Jegyezd meg az <selector> ??rt??k??t az <key> azonos??t??val",
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
            "Jegyezd meg a <value> ??rt??ket a <key> azonos??t??val",
            "Jegyezd meg a <value> ??rt??ket az <key> azonos??t??val",
            "Jegyezd meg az <value> ??rt??ket a <key> azonos??t??val",
            "Jegyezd meg az <value> ??rt??ket az <key> azonos??t??val",
        ])
    public async storeValueIncache(value: string, key: string) {
        value = this.resolvePlaceholder(value);
        Gauge.writeMessage(value);

        let specStore: DataStore = DataStoreFactory.getSpecDataStore();
        specStore.put(key, value);
    }

    @Step([
        "T??r??ld a <selector> elem sz??veg??t",
        "T??r??ld a <selector> ID-val rendelekez?? elem sz??veg??t"
    ])
    public async deleteElementContent(selector: string) {
        selector = this.resolvePlaceholder(selector);
        selector = this.selectorCorrection(selector);

        await currentPage.fill(selector, '');
    }

    @Step([
        "<fileName> f??jl felt??lt??se a <fileSelector> mez??n kereszt??l"
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
            "??rd a <text> sz??veget a <selector> elembe",
            "??rd az <text> sz??veget a <selector> elembe",
            "??rd a <text> sz??veget az <selector> elembe",
            "??rd az <text> sz??veget az <selector> elembe",
            "??rd ezt a sz??veget <text> a <selector> c??mk??vel rendelkez?? elembe",
            "??rd a <text> sz??veget a <selector> c??mk??vel rendelkez?? elembe",
            "??rd az <text> sz??veget a <selector> c??mk??vel rendelkez?? elembe",
            "??rd a <text> sz??veget az <selector> c??mk??vel rendelkez?? elembe",
            "??rd az <text> sz??veget az <selector> c??mk??vel rendelkez?? elembe",
        ])
    public async typeInput(text: string, selector: string) {
        text = this.resolvePlaceholder(text);
        selector = this.resolvePlaceholder(selector);
        selector = this.selectorCorrection(selector);

        await currentPage.type(selector, text);
    }

    @Step([
        "Ellen??rizd le, hogy a <selector> <paramName> param??ter??nek az ??rt??ke <value>",
        "Ellen??rizd le, hogy az <selector> <paramName> param??ter??nek az ??rt??ke <value>"
    ])
    public async CheckIfSelectedParamContentIs(selector: string, paramName: string, value: string) {
        selector = this.resolvePlaceholder(selector);
        selector = this.selectorCorrection(selector);

        const attributeValue = await currentPage.getAttribute(selector, paramName);
        expect(attributeValue).toBe(value);
    }

    @Step([
        "Ellen??rizd le, hogy a <text> sz??veg nem tal??lhat?? meg az oldalon",
        "Ellen??rizd le, hogy az <text> sz??veg nem tal??lhat?? meg az oldalon"
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
