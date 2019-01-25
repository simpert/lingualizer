import chalkpack = require('chalk');
export declare const chalk: chalkpack.Chalk;
export declare const terminalPrefix: string;
export declare function log(message?: any): any;
export interface IArgV {
    verbose?: boolean;
    basedOff?: string;
    v?: boolean;
    version?: boolean;
    value?: string;
    force?: boolean;
    defaultLocale?: string;
    defaultranslationFileName?: string;
    defaulLocalizationDirName?: string;
    defaultranslationFileExt?: string;
    key?: string;
    k?: string;
    fileName?: string;
    locale?: string;
    l?: string;
    $0: string;
    _: string;
    asyncResult: Promise<any>;
}
export declare function getLocale(argv: IArgV): string;
export declare function shouldUseProjectName(): boolean;
/**
 * gets the name of the localization directory considering project dir name lookup
 */
export declare function getLocalizationFileName(): string;
/**
 * gets the path to the localization directory according to the default directory name
 */
export declare function getLocalizationDirectory(): string;
/**
 * given the locale will return the file name
 * @param locale the given locale, if none then assume default
 */
export declare function getFileName(argv: IArgV): string;
export declare function isValidUrl(url: string): boolean;
/**
 * get json contents from a file or from a url
 * @param url a url that will return a json file
 * @param filePath a complete filepath to a valid json file
 */
export declare function getJsonFile(url?: string, filePath?: string): Promise<string>;
/**
 * so yargs lib says is async but return promise from handler and will not wait for resolution
 * get json contents from a file or from a url
 * @param url a url that will return a json file
 * @param filePath a complete filepath to a valid json file
 */
export declare function getJsonFileSync(url?: string, filePath?: string): string;
export declare function writeFile(filePath: string, contents: any): boolean;
export declare function getValue(obj: object, dotSeperatedKey: string): any;
