"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var fse = require("fs-extra");
var findup = require("find-up");
var ste_events_1 = require("ste-events");
var util_1 = require("util");
var chalk_1 = require("chalk");
var common_1 = require("./common");
var configPath = findup.sync(['.lingualizerrc', '.lingualizerrc.json']);
var configrc = configPath ? fse.readJSONSync(configPath) : {};
var app = chalk_1.default.white('lingualizer->');
var Lookup = [
    { locale: 'en-US', tag: 'English', language: 'United States' },
    { locale: 'es-MX', tag: 'Spanish', language: 'Mexico' },
    { locale: 'fr-FR', tag: 'French', language: 'France' },
    { locale: 'nl-NL', tag: 'Dutch', language: 'Netherlands' },
    { locale: 'de-DE', tag: 'German', language: 'Germany' },
    { locale: 'it-IT', tag: 'Italian', language: 'Italian' },
    { locale: 'pol', tag: 'Polish', language: 'Poland' },
];
/**
 * singleton lingualizer type to offer all functionality of module
 *
 * @author tsimper
 * @date 2019-01-17
 * @export
 * @class Lingualizer
 */
var Lingualizer = /** @class */ (function () {
    /**
     * initialize a the single new instance of Lingualizer
     */
    function Lingualizer() {
        this._errorMessages = [
            "unable to find a translations directory  at '%s'.",
            "unable to find a translations file for '%s' at %s" /* initTranslations sub 1 */
        ];
        this._defaultLocaleTranslations = {};
        this._translations = {};
        this._locale = null;
        this._onLocaleChanged = new ste_events_1.EventDispatcher();
        this._locale = Lingualizer.DefaultLocale;
        this.initTranslations();
    }
    Object.defineProperty(Lingualizer, "default", {
        get: function () {
            if (Lingualizer._instance == null)
                Lingualizer._instance = new Lingualizer();
            //TODO: look for and read in `.lingualizerrc settings
            return Lingualizer._instance;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Lingualizer.prototype, "onLocaleChanged", {
        /**
         * subscribe to get notified when the locale changes
         *
         * @readonly
         * @type {IEvent<Lingualizer, LocaleChangedEventArgs>} gives the Lingualizer instance that raised the event and a object containing the old and new locales
         * @memberof Lingualizer
         */
        get: function () {
            return this._onLocaleChanged.asEvent();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Lingualizer.prototype, "locale", {
        /**
         * gets the currently set locale. will return `null` if locale has not been set
         * and can assume to use default locale
         *
         * @type {Locale}
         * @memberof Lingualizer
         */
        get: function () {
            return this._locale;
        },
        /**
         * set the current locale. will trigger the `localeChanged` event so subscribers
         * can get translations from the newly set locale
         *
         * @memberof Lingualizer
         */
        set: function (locale) {
            var oldLocale = this._locale;
            if (oldLocale == locale)
                return;
            this._locale = locale;
            this.initTranslations(oldLocale);
            //console.log( `set locale to ${ this._locale }` );
        },
        enumerable: true,
        configurable: true
    });
    /**
     * get a keys value from translated locale or default locale if non-default locale is set and the key cannot be found
     *
     * @author tsimper
     * @date 2019-01-24
     * @param {string} key the name of the string to look up
     * @returns {string} the tranlated string or default if no translation found or default locale set and if no default returns null
     * @memberof Lingualizer
     */
    Lingualizer.prototype.get = function (key) {
        if (this._defaultLocaleTranslations == null && this._translations == null)
            return '';
        var value = null;
        if (this.locale !== Lingualizer.DefaultLocale && this._translations !== null) {
            var getVal = common_1.getValue(this._translations, key);
            if (typeof getVal !== 'undefined') {
                return getVal;
            }
        }
        // allways try to return the string from default tranlation file even if cant find a translated one
        if (this._defaultLocaleTranslations !== null) {
            var getVal = common_1.getValue(this._defaultLocaleTranslations, key);
            if (typeof getVal !== 'undefined')
                value = getVal;
        }
        return value;
    };
    /**
     * set `_translations` to json read from translations.json file according to the currently set locale
     *
     * @author tsimper
     * @date 2019-01-15
     * @export
     * @returns
     */
    Lingualizer.prototype.initTranslations = function (oldLocale) {
        if (oldLocale === void 0) { oldLocale = this._locale; }
        var translationsPath = common_1.getLocalizationDirectory();
        if (!fse.existsSync(translationsPath))
            throw new Error(util_1.format(this._errorMessages[0], translationsPath));
        var defaultFile = path.join(translationsPath, common_1.getLocalizationFileName() + "." + Lingualizer.DefaultranslationFileExt);
        var localeFile = path.join(translationsPath, common_1.getLocalizationFileName() + "." + this.locale + "." + Lingualizer.DefaultranslationFileExt);
        // allways try load the default locale translations as we dish them if translated cant be found and it's the most common
        //  as in what would be loaded at starup only changing if set locale to non-default
        if (fse.existsSync(defaultFile)) {
            this._defaultLocaleTranslations = JSON.parse(fse.readFileSync(defaultFile, "utf8"));
            this._onLocaleChanged.dispatch(this, { oldLocale: oldLocale, newLocale: this._locale });
        }
        else {
            if (this.locale == Lingualizer.DefaultLocale)
                throw new Error(util_1.format(this._errorMessages[1], this._locale, defaultFile));
        }
        if (this.locale !== Lingualizer.DefaultLocale) 
        // try load non-default locale
        {
            if (fse.existsSync(localeFile)) {
                this._translations = JSON.parse(fse.readFileSync(localeFile, "utf8"));
                this._onLocaleChanged.dispatch(this, { oldLocale: oldLocale, newLocale: this._locale });
            }
            else {
                //console.log( `${ terminalPrefix } requested locale translation file cannot be found.` );
                throw new Error(util_1.format(this._errorMessages[1], this._locale, defaultFile));
            }
        }
    };
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
    Lingualizer.updateDefaults = function (configu) {
        var config = configu || configrc;
        if (config == null)
            return;
        if (config.defaultLocale)
            Lingualizer.DefaultLocale = config.defaultLocale;
        if (config.defaulLocalizationDirName)
            Lingualizer.DefaulLocalizationDirName = config.defaulLocalizationDirName;
        if (config.defaultranslationFileName)
            Lingualizer.DefaultranslationFileName = config.defaultranslationFileName;
        if (config.defaultranslationFileExt)
            Lingualizer.DefaultranslationFileExt = config.defaultranslationFileExt;
        if (config.cwd)
            Lingualizer.Cwd = config.cwd;
        return config;
    };
    /**
     * # for internal use
     *
     * @author tsimper
     * @date 2019-01-18
     * @static
     * @returns
     * @memberof Lingualizer
     */
    Lingualizer.printDefaults = function () {
        console.log(chalk_1.default.gray(app + " " + chalk_1.default.bold.green('Default Settings') + " locale: " + chalk_1.default.cyan(Lingualizer.DefaultLocale) + " directory: " + chalk_1.default.cyan(Lingualizer.DefaulLocalizationDirName) + " file: " + chalk_1.default.cyan(common_1.getLocalizationFileName()) + " ext: '" + chalk_1.default.cyan(Lingualizer.DefaultranslationFileExt) + "'"));
    };
    /* if config provided, these defaults will be set to config upon file load */
    Lingualizer.DefaultLocale = 'en-US';
    Lingualizer.DefaultranslationFileName = '%project%';
    Lingualizer.DefaulLocalizationDirName = 'localization';
    Lingualizer.DefaultranslationFileExt = 'json';
    Lingualizer.Cwd = '';
    Lingualizer._instance = null;
    return Lingualizer;
}());
exports.Lingualizer = Lingualizer;
