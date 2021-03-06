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

  @Step("Navig??lj az alkalmaz??shoz")
  public async openApp() {
    let appURL = process.env.app_url.toString();
    Utils.Message(appURL);

    await currentPage.goto(appURL);
  }

  @Step("??llj!")
  public async pause() {
    await currentPage.pause();
  }

  @Step("Navig??lj az <url> URL-re")
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
    "Kattints a <selector> f??lre",
    "Kattints az <selector> f??lre",
  ])
  public async click(selector: string) {
    selector = Utils.ResolvePlaceholder(selector);
    selector = Utils.SelectorCorrection(selector);

    await currentPage.click(selector);
  }

  @Step([
    "Kattints dupl??n a <selector> elemre",
    "Kattints dupl??n az <selector> elemre",
    "Kattints dupl??n a <selector> gombra",
    "Kattints dupl??n az <selector> gombra",
    "Kattints dupl??n a <selector> f??lre",
    "Kattints dupl??n az <selector> f??lre",
  ])
  public async doubleclick(selector: string) {
    selector = Utils.ResolvePlaceholder(selector);
    selector = Utils.SelectorCorrection(selector);

    await currentPage.dblclick(selector);
  }

  @Step([
    "Kattints a <selector> elemre ??s v??lts az ??jjonan megny??l?? b??ng??sz?? f??lre",
    "Kattints az <selector> elemre ??s v??lts az ??jjonan megny??l?? b??ng??sz?? f??lre",
    "Kattints a <selector> gombra ??s v??lts az ??jjonan megny??l?? b??ng??sz?? f??lre",
    "Kattints az <selector> gombra ??s v??lts az ??jjonan megny??l?? b??ng??sz?? f??lre",
    "Kattints a <selector> f??lre ??s v??lts az ??jjonan megny??l?? b??ng??sz?? f??lre",
    "Kattints az <selector> f??lre ??s v??lts az ??jjonan megny??l?? b??ng??sz?? f??lre",
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
    "Kattints a <tableId> t??bl??zat <rowId>. sor <columnId>. oszlop??ra",
    "Kattints az <tableId> t??bl??zat <rowId>. sor <columnId>. oszlop??ra",
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
    "V??laszd ki a <dropdownLabel> leg??rd??l?? list??b??l a <dropdownValue> c??mk??j?? elemet",
    "V??laszd ki a <dropdownLabel> leg??rd??l?? list??b??l az <dropdownValue> c??mk??j?? elemet",
    "V??laszd ki az <dropdownLabel> leg??rd??l?? list??b??l az <dropdownValue> c??mk??j?? elemet",
    "V??laszd ki az <dropdownLabel> leg??rd??l?? list??b??l a <dropdownValue> c??mk??j?? elemet",
  ])
  public async selectElementByLabel(selector: string, dropdownValue: string) {
    selector = Utils.ResolvePlaceholder(selector);
    selector = Utils.SelectorCorrection(selector);
    dropdownValue = Utils.ResolvePlaceholder(dropdownValue);

    await currentPage.selectOption(selector, { label: dropdownValue });
  }

  @Step([
    "V??laszd ki a <checkBoxLabel> jel??l??n??gyzetet(checkbox)",
    "V??laszd ki az <checkBoxLabel> jel??l??n??gyzetet(checkbox)",
    "Pip??ld ki a <checkBoxLabel> jel??l??n??gyzetet(checkbox)",
    "Pip??ld ki az <checkBoxLabel> jel??l??n??gyzetet(checkbox)",
  ])
  public async checkByLabel(checkBoxLabel) {
    let checkBox = currentPage.locator(
      `label:has-text("${checkBoxLabel}") >> visible=true`
    );

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
    selector = Utils.ResolvePlaceholder(selector);
    selector = Utils.SelectorCorrection(selector);

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
    selector = Utils.ResolvePlaceholder(selector);
    selector = Utils.SelectorCorrection(selector);

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
    selector = Utils.ResolvePlaceholder(selector);
    selector = Utils.SelectorCorrection(selector);

    await currentPage.waitForSelector(selector, { state: "attached" });
  }

  @Step([
    "Ellen??rizd le, hogy a <selector> sz??veg megtal??lhat?? az oldalon",
    "Ellen??rizd le, hogy az <selector> sz??veg megtal??lhat?? az oldalon",
  ])
  public async isTextOnThePage(selector: string) {
    selector = Utils.ResolvePlaceholder(selector);
    selector = Utils.SelectorCorrection(selector);

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
    selector = Utils.ResolvePlaceholder(selector);
    selector = Utils.SelectorCorrection(selector);

    await currentPage.waitForSelector(selector, { state: "detached" });
  }

  @Step([
    "Jegyezd meg a <selector> ??rt??k??t a <key> azonos??t??val",
    "Jegyezd meg a <selector> ??rt??k??t az <key> azonos??t??val",
    "Jegyezd meg az <selector> ??rt??k??t a <key> azonos??t??val",
    "Jegyezd meg az <selector> ??rt??k??t az <key> azonos??t??val",
  ])
  public async storeSelectedValueInCache(selector: string, key: string) {
    selector = Utils.ResolvePlaceholder(selector);
    selector = Utils.SelectorCorrection(selector);
    let txt = (await currentPage.textContent(selector)).trim();
    Utils.Message(txt);

    Utils.SetCacheItem(key, txt);
  }

  @Step([
    "Jegyezd meg a <value> ??rt??ket a <key> azonos??t??val",
    "Jegyezd meg a <value> ??rt??ket az <key> azonos??t??val",
    "Jegyezd meg az <value> ??rt??ket a <key> azonos??t??val",
    "Jegyezd meg az <value> ??rt??ket az <key> azonos??t??val",
  ])
  public async storeValueIncache(value: string, key: string) {
    value = Utils.ResolvePlaceholder(value);
    Utils.Message(value);

    Utils.SetCacheItem(key, value);
  }

  @Step(["Jegyezd meg az aktu??lis URL-t, ezzel az azonos??t??val <key>"])
  public async storeUrlInCache(key: string) {
    key = Utils.ResolvePlaceholder(key);
    Utils.Message(key);

    let value = currentPage.url();
    Utils.SetCacheItem(key, value);
  }

  @Step([
    "T??r??ld a <selector> elem sz??veg??t",
    "T??r??ld a <selector> ID-val rendelekez?? elem sz??veg??t",
  ])
  public async deleteElementContent(selector: string) {
    selector = Utils.ResolvePlaceholder(selector);
    selector = Utils.SelectorCorrection(selector);

    await currentPage.fill(selector, "");
  }

  @Step(["<fileName> f??jl felt??lt??se a <fileSelector> mez??n kereszt??l"])
  public async fileUploadByInput(fileName: string, selector: string) {
    selector = Utils.ResolvePlaceholder(selector);
    selector = Utils.SelectorCorrection(selector, "");

    await currentPage.setInputFiles(
      selector,
      path.join(__dirname, "..", "test_files", fileName)
    );
  }

  @Step([
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
    text = Utils.ResolvePlaceholder(text);
    selector = Utils.ResolvePlaceholder(selector);
    selector = Utils.SelectorCorrection(selector);

    await currentPage.type(selector, text);
  }

  @Step([
    "Ellen??rizd le, hogy a <selector> <paramName> param??ter??nek az ??rt??ke <value>",
    "Ellen??rizd le, hogy az <selector> <paramName> param??ter??nek az ??rt??ke <value>",
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
    "Ellen??rizd le, hogy a <text> sz??veg nem tal??lhat?? meg az oldalon",
    "Ellen??rizd le, hogy az <text> sz??veg nem tal??lhat?? meg az oldalon",
  ])
  public async CheckIfTextIsNotOnThePage(text: string) {
    text = Utils.ResolvePlaceholder(text);

    await currentPage.waitForSelector(`text=${text}`, { state: "detached" });
  }

  @Step(["Ellen??rizd le, hogy az elem <selector> nem ??res az oldalon"])
  public async CheckIfSelectNotEmpty(selector: string) {
    selector = Utils.ResolvePlaceholder(selector);
    selector = Utils.SelectorCorrection(selector);

    let value = await currentPage.inputValue(selector);
    expect(value != undefined && value != "").toBeTruthy();
  }

  @Step(
    "Kattints dupl??n a <tableSelector> t??bl??zat <row>. sor <col>. oszlop??ra"
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
    "??rd ezt a sz??veget <txt> a <selector> elem alatti <selectorAbove> c??mk??vel rendelkez?? elembe",
    "??rd ezt a sz??veget <txt> az <selector> elem alatti <selectorAbove> c??mk??vel rendelkez?? elembe",
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
  @Step("Nyomd meg a <key> billenty??t a billenty??zeten")
  public async pressThisKey(key: string) {
    await currentPage.keyboard.press(key);
  }
  @Step("Vidd az egeret a <selector> elem f??l??")
  public async hoverElement(selector: string) {
    selector = Utils.ResolvePlaceholder(selector);
    selector = Utils.SelectorCorrection(selector);

    currentPage.hover(selector);
  }
}
