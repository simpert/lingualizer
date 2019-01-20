import { IEvent } from "ste-events";
export declare type Locale = 'en-US' | 'es-MX' | null;
export declare type LocaleChangedEventArgs = {
    oldLocale: Locale;
    newLocale: Locale;
};
/**
 * singleton lingualizer type to offer all functionality of module
 *
 * @author tsimper
 * @date 2019-01-17
 * @export
 * @class Lingualizer
 */
export declare class Lingualizer {
    private _errorMessages;
    static DefaultLocale: Locale;
    static DefaultranslationFileName: string;
    static DefaulLocalizationDirName: string;
    static DefaultranslationFileExt: string;
    private static _instance;
    private _translations;
    private _locale;
    private _onLocaleChanged;
    /**
     * initialize a the single new instance of Lingualizer
     */
    private constructor();
    static readonly default: Lingualizer;
    /**
     * subscribe to get notified when the locale changes
     *
     * @readonly
     * @type {IEvent<Lingualizer, LocaleChangedEventArgs>} gives the Lingualizer instance that raised the event and a object containing the old and new locales
     * @memberof Lingualizer
     */
    readonly onLocaleChanged: IEvent<Lingualizer, LocaleChangedEventArgs>;
    /**
     * set the current locale. will trigger the `localeChanged` event so subscribers
     * can get translations from the newly set locale
     *
     * @memberof Lingualizer
     */
    /**
    * gets the currently set locale. will return `null` if locale has not been set
    * and can assume to use default locale
    *
    * @type {Locale}
    * @memberof Lingualizer
    */
    locale: Locale;
    get(key: string): string;
    /**
     * set `_translations` to json read from translations.json file according to the currently set locale
     *
     * @author tsimper
     * @date 2019-01-15
     * @export
     * @returns
     */
    initTranslations(oldLocale?: Locale): void;
    /**
     * # for internal use
     *
     * @author tsimper
     * @date 2019-01-18
     * @static
     * @param {*} [configu]
     * @returns {*}
     * @memberof Lingualizer
     */
    static updateDefaults(configu?: any): any;
    /**
     * # for internal use
     *
     * @author tsimper
     * @date 2019-01-18
     * @static
     * @returns
     * @memberof Lingualizer
     */
    static printDefaults(): void;
}