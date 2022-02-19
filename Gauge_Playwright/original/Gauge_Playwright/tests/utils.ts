import {
    DataStore,
    DataStoreFactory,
    Gauge,
} from "gauge-ts";
import * as randomstring from "randomstring";

export function ResolvePlaceholder(param: string): string {
    if (param.startsWith("ENV:")) {
        param = this.GetEnvironmentVariable(param);
    }

    if (param.startsWith("CACHE:")) {
        param = this.GetCacheItem(param);
    }

    if (param.startsWith("RAND:")) {
        param = this.Randimize(param);
    }

    return param;
}

export function SelectorCorrection(param: string, visible: string = '>> visible=true') {
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

export function GetEnvironmentVariable(param: string) {
    let paramName = param.split(":")[1];
    param = process.env[paramName];

    this.Message("ENV: " + param);

    return param;
}

export function GetCacheItem(param: string) {
    let key = param.split(":")[1];

    let specStore: DataStore = DataStoreFactory.getSpecDataStore();
    param = specStore.get(key) as string;
    this.Message(key + ": " + param);

    return param;
}

export function SetCacheItem(key: string, value: string) {
    let specStore: DataStore = DataStoreFactory.getSpecDataStore();
    specStore.put(key, value);
}

export function Randimize(param: string): string {
    let cs = param.split(":")[1];
    let l = parseInt(param.split(":")[2]);
    let isPrefix = param.split(":")[3];
    let prefixText = param.split(":")[4];

    param = randomstring.generate({
        charset: cs,
        length: l,
    });

    if (isPrefix == 'PREFIX') {
        param = prefixText + param;
    }

    this.Message(param);

    return param;
}

export function Message(msg: string) {
    Gauge.writeMessage(msg);
    console.log(msg);
}
