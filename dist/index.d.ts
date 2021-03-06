import { IEvent } from 'ste-events';
import { Locale } from './ILocale';
import { ILogger } from './ILogger';
import { LocaleChangedEventArgs } from './LocaleChangedEventArgs';
/**
 *  lingualizer class to offer all functionality of module
 *
 * @export
 * @class Lingualizer
 */
export declare class Lingualizer {
    private static _errorMessages;
    private static _logger;
    /**
     * #### Default locale or config's `defaultLocale` if found.
     *
     * |config|name|
     * |:------|:----|
     * |.lingualizerrc|`defaultLocale`|
     * |package.json|`lingualizer.defaultLocale`|
     * @static
     * @type {Locale}
     * @memberof Lingualizer
     */
    static DefaultLocale: Locale;
    /**
     * #### Translation file name _[without extention]_.
     * > If `%project%` then the @{link Lingualizer#ProjectRoot} dir **basename** name is used.
     *
     * |config|name|
     * |:------|:----|
     * |.lingualizerrc|`defaultranslationFileName`|
     * |package.json|`lingualizer.defaultranslationFileName`|
     * @static
     * @memberof Lingualizer
     */
    static DefaultranslationFileName: string;
    /**
     * #### Name of localization directory where translation files are stored.
     *
     * |config|name|
     * |:------|:----|
     * |.lingualizerrc|`defaulLocalizationDirName`|
     * |package.json|`lingualizer.defaulLocalizationDirName`|
     * @static
     * @memberof Lingualizer
     */
    static DefaulLocalizationDirName: string;
    /**
     * #### Translation file extention to use.
     * > currently only `json` is supported.
     *
     * |config|name|
     * |:------|:----|
     * |.lingualizerrc|`defaultTranslationFileExt`|
     * |package.json|`lingualizer.defaultTranslationFileExt`|
     * @static
     * @memberof Lingualizer
     */
    static DefaultTranslationFileExt: string;
    /**
     * #### Is an `electron` application.
     * _ignored if set abs path with @{link Lingualizer#setProjectRoot}_
     *
     * > this is used to try different methods of determining project root.
     * > for instance may be in `.asar` at runtime.
     *
     * |config|name|
     * |:------|:----|
     * |.lingualizerrc|`isElectron`|
     * |package.json|`lingualizer.isElectron`|
     * @static
     * @memberof Lingualizer
     */
    static IsElectron: boolean;
    /**
     * #### Alternative directory path relative to @{link Linugalizer#ProjectRoot}
     * > use this to specify a directory path from the project root directory of the directory to create the `localization` directory in.
     *
     * |config|name|
     * |:------|:----|
     * |.lingualizerrc|`cwd`|
     * |package.json|`lingualizer.cwd`|
     * @static
     * @memberof Lingualizer
     */
    static Cwd: string;
    /**
     * #### _(for terminal use)_ Alternative directory path relative to @{link Linugalizer#ProjectRoot}
     * > use this to specify a directory path from the project root directory of the directory to create the `localization` directory in.
     *
     * |config|name|
     * |:------|:----|
     * |.lingualizerrc|`cmdCwd`|
     * |package.json|`lingualizer.cmdCwd`|
     * @static
     * @memberof Lingualizer
     */
    static CmdCwd: string;
    /**
     * #### The project directory's absolute path.
     * > please use @{link Lingualizer#setProjectDir} to modify root
     *
     * @static
     * @memberof Lingualizer
     */
    static ProjectRoot: string;
    private static config;
    private static _defaultLocaleTranslations;
    private static _translations;
    private static _locale;
    private static _onLocaleChanged;
    private static _projectRoot;
    static __ctor__: void;
    private static logInfo;
    private static logError;
    static root: string;
    /**
     * #### Get the localeChanged event
     * > subscribe to event to get notified of locale changing.
     *
     * @property {IEvent<Lingualizer, LocaleChangedEventArgs>} Lingualizer.default.onLocaleChanged
     * @readonly
     * @type {IEvent<Lingualizer, LocaleChangedEventArgs>} gives the Lingualizer instance that raised the event and a object containing the old and new locales
     * @memberof Lingualizer
     */
    static readonly onLocaleChanged: IEvent<Lingualizer, LocaleChangedEventArgs>;
    /**
     * #### Set the current locale.
     * > will trigger the `localeChanged` event so subscribers can get translations from the newly set locale
     *
     * @fires onLocaleChanged
     * @type {Locale}
     * @property {Locale} Lingualizer.default.locale
     * @memberof Lingualizer
     */
    /**
    * #### Gets the current locale.
    * > will return `null` if locale has not been set
    * > if not set, @{link Lingualizer.default.get()} will use @{link Lingualizer#DefaultLocale}
    */
    static locale: Locale;
    /**
     * #### Get a translation
     * > get a keys value from translated locale or default locale if non-default locale is set and the key cannot be found
     *
     * @param {string} key the name _[key]_ of the string to look up
     * @returns {string} get a keys value from translated locale or default locale if non-default locale is set and the key cannot be found
     * @memberof Lingualizer
     */
    static get(key: string): string;
    /**
     * #### Initialize translations.
     * > reads the translation file json into memory for future get requests
     *
     * @export
     * @returns
     */
    static initTranslations(oldLocale?: Locale): void;
    /**
     * #### Set the Lingualizer logger.
     * > all logging messages will try to log using set logger with info and error functions if they exist.
     *
     * @param {ILogger} logger a logger object that contains at least a info and error logging methods
     * @memberof Lingualizer
     */
    static setLogger(logger: ILogger): void;
    /**
     * #### Set the project's absolute path
     * > use if default's are not working for your configuration.
     * > the path must exist to successfully set the ProjectRoot.
     *
     * @static
     * @param {string} projectDir the absolute path to use for determining Lingualizer related paths.
     * @memberof Lingualizer
     */
    static setProjectDir(projectDir: string): void;
    /**
     * # for internal use
     * > sets all @{link Lingualizer} static defaults with provided `configu` or:
     * > - looks up any `.lingualizerrc` | `.lingualizerrc.json` and uses this if found
     * > - looks up any `lingualizer` in `package.json` and uses this if found
     *
     * > if no `configu` argument is provided and the configuration has allready been looked up, it will not be looked up again.
     *
     * @static
     * @param {*} [configu] configuration object to use to set all defaults with
     * @returns {*} the current determined configuration object
     * @memberof Lingualizer
     */
    static updateDefaults(configu?: any): any;
    /**
     * # for internal use
     * > prints to console all the configuration and current defaults as determined.
     *
     * @static
     * @returns
     * @memberof Lingualizer
     */
    static printDefaults(): string;
}
