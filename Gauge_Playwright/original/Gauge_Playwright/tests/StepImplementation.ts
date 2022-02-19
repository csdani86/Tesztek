import * as path from "path";
import { expect } from "@playwright/test";
import * as Utils from "./utils";
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
  BeforeStep,
  BeforeSuite,
  ContinueOnFailure,
  CustomScreenshotWriter,
  DataStore,
  DataStoreFactory,
  Gauge,
  Step,
  Table,
} from "gauge-ts";
import { assert } from "console";

let isTracing: boolean = true;
let currentPage: Page;
let browser: Browser;
let browserHistory: Page[] = [];
let browserCtx: BrowserContext;
let browserCtxOptions: BrowserContextOptions = {
  strictSelectors: true,
  screen: {
    width: 1284,
    height: 720,
  },
  viewport: {
    width: 1284,
    height: 720,
  },
  /*recordVideo: {
        dir: './videos/'
    }*/
};

export default class StepImplementation {
  @BeforeSuite()
  public async beforeSuite() {
    browser = await chromium.launch({ headless: process.env.headless_chrome.toLowerCase() === 'true' });
    browserCtx = await browser.newContext(browserCtxOptions);
    await this.newPage();

    // Tracing
    if (isTracing) {
      browserCtx.tracing.start({
        screenshots: true,
        snapshots: true,
      });
    }

    // event liseners
    browserCtx.on("page", async (newPage) => {
      await this.newPage(newPage);
      Utils.Message("New page");
    });

    browserCtx.on("close", async () => {
      await this.closePage();
      Utils.Message("Close page");
    });
  }

  private async newPage(newPage?: Page) {
    if (newPage == undefined) {
      currentPage = await browserCtx.newPage();
    }
    else {
      browserHistory.push(currentPage);

      currentPage = newPage;
    }

    // override the defaults of the page attributes
    currentPage.setDefaultTimeout(60000);

    // handling JS alert(), comfirm(), prompt() to always accept
    currentPage.on('dialog', async (dialog) => {
      Utils.Message("Dialog");
      Utils.Message(dialog.message());
      await dialog.accept();
    });
  }

  private async closePage() {
    if (browserHistory.length > 1) {
      currentPage = browserHistory.pop();
    } else {
      browser.close();
    }
  }

  @AfterSuite()
  public async afterSuite() {
    if (isTracing) {
      await browserCtx.tracing.stop({
        path: "trace.zip",
      });
    }
    await browser.close();
  }

  @BeforeStep()
  public async beforeStep() { }

  @CustomScreenshotWriter()
  public async customScreenshotWriter(): Promise<string> {
    const screenshotFilePath = path
      .join(
        process.env["gauge_screenshots_dir"],
        `screenshot-${process.hrtime.bigint()}.png`
      )
      .replace("/", "\\");

    let options: PageScreenshotOptions = {
      path: screenshotFilePath,
      fullPage: true,
    };

    await currentPage.screenshot(options);

    return path.basename(screenshotFilePath);
  }

  @Step("Navigálj az alkalmazáshoz")
  public async openApp() {
    let appURL = process.env.app_url.toString();
    Utils.Message(appURL);

    await currentPage.goto(appURL);
  }

  @Step("Állj!")
  public async pause() {
    await currentPage.pause();
  }

  @Step("Navigálj az <url> URL-re")
  public async openUrl(url: string) {
    url = Utils.ResolvePlaceholder(url);
    Utils.Message(url);

    await currentPage.goto(url);
  }

  @Step("Nyomj egy F5-t")
  public async pressF5Button() {
    await currentPage.keyboard.press("F5");
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
    selector = Utils.ResolvePlaceholder(selector);
    selector = Utils.SelectorCorrection(selector);

    await currentPage.click(selector);
  }

  @Step([
    "Kattints duplán a <selector> elemre",
    "Kattints duplán az <selector> elemre",
    "Kattints duplán a <selector> gombra",
    "Kattints duplán az <selector> gombra",
    "Kattints duplán a <selector> fülre",
    "Kattints duplán az <selector> fülre",
  ])
  public async doubleclick(selector: string) {
    selector = Utils.ResolvePlaceholder(selector);
    selector = Utils.SelectorCorrection(selector);

    await currentPage.dblclick(selector);
  }

  @Step([
    "Kattints a <selector> elemre és válts az újjonan megnyíló böngésző fülre",
    "Kattints az <selector> elemre és válts az újjonan megnyíló böngésző fülre",
    "Kattints a <selector> gombra és válts az újjonan megnyíló böngésző fülre",
    "Kattints az <selector> gombra és válts az újjonan megnyíló böngésző fülre",
    "Kattints a <selector> fülre és válts az újjonan megnyíló böngésző fülre",
    "Kattints az <selector> fülre és válts az újjonan megnyíló böngésző fülre",
  ])
  public async clickPopup(selector: string) {
    selector = Utils.ResolvePlaceholder(selector);
    selector = Utils.SelectorCorrection(selector);

    const [pageNew] = await Promise.all([
      currentPage.waitForEvent("popup"),
      currentPage.click(selector),
    ]);

    currentPage = pageNew;
  }

  @Step([
    "Kattints a <selector> elemre, ha tudsz",
    "Kattints az <selector> elemre, ha tudsz",
    "Kattints a <selector> gombra, ha tudsz",
    "Kattints az <selector> gombra, ha tudsz",
  ])
  public async clickIfYouCan(selector: string) {
    selector = Utils.ResolvePlaceholder(selector);
    selector = Utils.SelectorCorrection(selector);

    try {
      await currentPage.click(selector, { timeout: 5000 });
    } catch (e) { }
  }

  @Step([
    "Kattints a <tableId> táblázat <rowId>. sor <columnId>. oszlopára",
    "Kattints az <tableId> táblázat <rowId>. sor <columnId>. oszlopára",
  ])
  public async clickTableCell(
    tableId: string,
    rowId: string,
    columnId: string
  ) {
    await currentPage.click(
      `${tableId} tr:nth-child(${rowId}) td:nth-child(${columnId}) >> visible=true`
    );
  }

  @Step([
    "Válaszd ki a <dropdownLabel> legördülő listából a <dropdownValue> címkéjű elemet",
    "Válaszd ki a <dropdownLabel> legördülő listából az <dropdownValue> címkéjű elemet",
    "Válaszd ki az <dropdownLabel> legördülő listából az <dropdownValue> címkéjű elemet",
    "Válaszd ki az <dropdownLabel> legördülő listából a <dropdownValue> címkéjű elemet",
  ])
  public async selectElementByLabel(selector: string, dropdownValue: string) {
    selector = Utils.ResolvePlaceholder(selector);
    selector = Utils.SelectorCorrection(selector);
    dropdownValue = Utils.ResolvePlaceholder(dropdownValue);

    await currentPage.selectOption(selector, { label: dropdownValue });
  }

  @Step([
    "Válaszd ki a <checkBoxLabel> jelölőnégyzetet(checkbox)",
    "Válaszd ki az <checkBoxLabel> jelölőnégyzetet(checkbox)",
    "Pipáld ki a <checkBoxLabel> jelölőnégyzetet(checkbox)",
    "Pipáld ki az <checkBoxLabel> jelölőnégyzetet(checkbox)",
  ])
  public async checkByLabel(checkBoxLabel) {
    let checkBox = currentPage.locator(
      `label:has-text("${checkBoxLabel}") >> visible=true`
    );

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
    selector = Utils.ResolvePlaceholder(selector);
    selector = Utils.SelectorCorrection(selector);

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
    selector = Utils.ResolvePlaceholder(selector);
    selector = Utils.SelectorCorrection(selector);

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
    selector = Utils.ResolvePlaceholder(selector);
    selector = Utils.SelectorCorrection(selector);

    await currentPage.waitForSelector(selector, { state: "attached" });
  }

  @Step([
    "Ellenőrizd le, hogy a <selector> szöveg megtalálható az oldalon",
    "Ellenőrizd le, hogy az <selector> szöveg megtalálható az oldalon",
  ])
  public async isTextOnThePage(selector: string) {
    selector = Utils.ResolvePlaceholder(selector);
    selector = Utils.SelectorCorrection(selector);

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
    selector = Utils.ResolvePlaceholder(selector);
    selector = Utils.SelectorCorrection(selector);

    await currentPage.waitForSelector(selector, { state: "detached" });
  }

  @Step([
    "Jegyezd meg a <selector> értékét a <key> azonosítóval",
    "Jegyezd meg a <selector> értékét az <key> azonosítóval",
    "Jegyezd meg az <selector> értékét a <key> azonosítóval",
    "Jegyezd meg az <selector> értékét az <key> azonosítóval",
  ])
  public async storeSelectedValueInCache(selector: string, key: string) {
    selector = Utils.ResolvePlaceholder(selector);
    selector = Utils.SelectorCorrection(selector);
    let txt = (await currentPage.textContent(selector)).trim();
    Utils.Message(txt);

    Utils.SetCacheItem(key, txt);
  }

  @Step([
    "Jegyezd meg a <value> értéket a <key> azonosítóval",
    "Jegyezd meg a <value> értéket az <key> azonosítóval",
    "Jegyezd meg az <value> értéket a <key> azonosítóval",
    "Jegyezd meg az <value> értéket az <key> azonosítóval",
  ])
  public async storeValueIncache(value: string, key: string) {
    value = Utils.ResolvePlaceholder(value);
    Utils.Message(value);

    Utils.SetCacheItem(key, value);
  }

  @Step(["Jegyezd meg az aktuális URL-t, ezzel az azonosítóval <key>"])
  public async storeUrlInCache(key: string) {
    key = Utils.ResolvePlaceholder(key);
    Utils.Message(key);

    let value = currentPage.url();
    Utils.SetCacheItem(key, value);
  }

  @Step([
    "Töröld a <selector> elem szövegét",
    "Töröld a <selector> ID-val rendelekező elem szövegét",
  ])
  public async deleteElementContent(selector: string) {
    selector = Utils.ResolvePlaceholder(selector);
    selector = Utils.SelectorCorrection(selector);

    await currentPage.fill(selector, "");
  }

  @Step(["<fileName> fájl feltöltése a <fileSelector> mezőn keresztül"])
  public async fileUploadByInput(fileName: string, selector: string) {
    selector = Utils.ResolvePlaceholder(selector);
    selector = Utils.SelectorCorrection(selector, "");

    await currentPage.setInputFiles(
      selector,
      path.join(__dirname, "..", "test_files", fileName)
    );
  }

  @Step([
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
    text = Utils.ResolvePlaceholder(text);
    selector = Utils.ResolvePlaceholder(selector);
    selector = Utils.SelectorCorrection(selector);

    await currentPage.type(selector, text);
  }

  @Step([
    "Ellenőrizd le, hogy a <selector> <paramName> paraméterének az értéke <value>",
    "Ellenőrizd le, hogy az <selector> <paramName> paraméterének az értéke <value>",
  ])
  public async CheckIfSelectedParamContentIs(
    selector: string,
    paramName: string,
    value: string
  ) {
    selector = Utils.ResolvePlaceholder(selector);
    selector = Utils.SelectorCorrection(selector);

    const attributeValue = await currentPage.getAttribute(
      selector + ">> nth=0",
      paramName
    );
    expect(attributeValue).toBe(value);
  }

  @Step([
    "Ellenőrizd le, hogy a <text> szöveg nem található meg az oldalon",
    "Ellenőrizd le, hogy az <text> szöveg nem található meg az oldalon",
  ])
  public async CheckIfTextIsNotOnThePage(text: string) {
    text = Utils.ResolvePlaceholder(text);

    await currentPage.waitForSelector(`text=${text}`, { state: "detached" });
  }

  @Step(["Ellenőrizd le, hogy az elem <selector> nem üres az oldalon"])
  public async CheckIfSelectNotEmpty(selector: string) {
    selector = Utils.ResolvePlaceholder(selector);
    selector = Utils.SelectorCorrection(selector);

    let value = await currentPage.inputValue(selector);
    expect(value != undefined && value != "").toBeTruthy();
  }

  @Step(
    "Kattints duplán a <tableSelector> táblázat <row>. sor <col>. oszlopára"
  )
  public async doubleClickOnCell(
    tableSelector: string,
    row: number,
    col: number
  ) {
    let selector = Utils.ResolvePlaceholder(tableSelector);
    selector = `${selector} >> tr >> nth=${row} >> td >> nth=${col}`;
    selector = Utils.SelectorCorrection(selector);

    await currentPage.dblclick(selector);
  }
  @Step([
    "Írd ezt a szöveget <txt> a <selector> elem alatti <selectorAbove> címkével rendelkező elembe",
    "Írd ezt a szöveget <txt> az <selector> elem alatti <selectorAbove> címkével rendelkező elembe",
  ])
  public async writeTextToElementUderElement(
    txt: string,
    selector: string,
    selectorBelow: string
  ) {
    selector = Utils.ResolvePlaceholder(selector);
    selectorBelow = Utils.ResolvePlaceholder(selectorBelow);

    selector = `label:text("${selectorBelow}"):below(:text("${selector}")) >> visible=true >> nth=0`;

    await currentPage.type(selector, txt);
  }
  @Step([
    "Kattints a <selector> alatti <selectorBelow> gombra",
    "Kattints az <selector> alatti <selectorBelow> gombra",
    "Kattints a <selector> alatti <selectorBelow> elemre",
    "Kattints az <selector> alatti <selectorBelow> elemre",
  ])
  public async clickElementUnderElement(
    selector: string,
    selectorBelow: string
  ) {
    selector = Utils.ResolvePlaceholder(selector);
    selector = Utils.SelectorCorrection(selector);
    if (selector.startsWith("text=")) {
      selector = selector.split("=")[1].split(" >> ")[0];
      if (selector.startsWith("'")) {
        selector = `:text-is("${selector}")`;
      }
      selector = `:text("${selector}")`;
    }

    selectorBelow = Utils.ResolvePlaceholder(selectorBelow);
    if (selectorBelow.startsWith("text=")) {
      selectorBelow = selectorBelow.split("=")[1].split(" >> ")[0];
      if (selectorBelow.startsWith("'")) {
        selectorBelow = `:text-is("${selectorBelow}")`;
      }
      selectorBelow = `:text("${selectorBelow}")`;
    }

    selector = `:text-is("${selectorBelow}"):below(${selector})`;

    await currentPage.click(selector);
  }
  @Step("Nyomd meg a <key> billentyűt a billentyűzeten")
  public async pressThisKey(key: string) {
    await currentPage.keyboard.press(key);
  }
  @Step("Vidd az egeret a <selector> elem fölé")
  public async hoverElement(selector: string) {
    selector = Utils.ResolvePlaceholder(selector);
    selector = Utils.SelectorCorrection(selector);

    currentPage.hover(selector);
  }
}
