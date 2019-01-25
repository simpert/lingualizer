import * as path from 'path';
import * as fse from 'fs-extra';
import * as findup from 'find-up';
import { EventDispatcher, IEvent } from "ste-events";
import { format } from 'util';
import chalk from 'chalk';
import { getLocalizationDirectory, getLocalizationFileName, getValue } from './common';


const configPath = findup.sync( [ '.lingualizerrc', '.lingualizerrc.json' ] );
const configrc = configPath ? fse.readJSONSync( configPath ) : {}
const app = chalk.white( 'lingualizer->' );

/* specifies all possible locale's */
export type Locale = 'en-US' |
    'es-MX' |
    'fr-FR' |
    'nl-NL' |
    'de-DE' |
    'it-IT' |
    'pol' |
    'el-GR' |
    'pt-BR' |
    'pt-PT' |
    'ar-SA' |
    'zh-CHT' |
    'ko-KR' |
    'ja-JP' |
    'vi-VN' |
    'ro-RO' |
    'ru-RU' |
    'bg-BG' |
    'id-ID' |
    'mk-MK' |
    'th-TH' |
    'zh-CHS' |
    'tr-TR' |
    null;

interface ILocale
{
    locale: Locale;
    tag: string;
    language: string;
}
var Lookup: ILocale[] = [
    { locale: 'en-US', tag: 'English', language: 'United States' },
    { locale: 'es-MX', tag: 'Spanish', language: 'Mexico' },
    { locale: 'fr-FR', tag: 'French', language: 'France' },
    { locale: 'nl-NL', tag: 'Dutch', language: 'Netherlands' },
    { locale: 'de-DE', tag: 'German', language: 'Germany' },
    { locale: 'it-IT', tag: 'Italian', language: 'Italian' },
    { locale: 'pol', tag: 'Polish', language: 'Poland' },
];

/* specifies data args to pass to subscribers on locale changed event raised */
export type LocaleChangedEventArgs = {
    oldLocale: Locale;
    newLocale: Locale;
}

/**
 * singleton lingualizer type to offer all functionality of module
 *
 * @author tsimper
 * @date 2019-01-17
 * @export
 * @class Lingualizer
 */
export class Lingualizer
{
    private _errorMessages = [
        `unable to find a translations directory  at '%s'.`, /* initTranslations sub 0 */
        `unable to find a translations file for '%s' at %s` /* initTranslations sub 1 */
    ];

    /* if config provided, these defaults will be set to config upon file load */
    public static DefaultLocale: Locale = 'en-US';
    public static DefaultranslationFileName = '%project%';
    public static DefaulLocalizationDirName = 'localization';
    public static DefaultranslationFileExt = 'json';
    public static Cwd = '';
    private static _instance: Lingualizer = null;
    private _defaultLocaleTranslations = {};
    private _translations = {};
    private _locale: Locale | null = null;
    private _onLocaleChanged: EventDispatcher<Lingualizer, LocaleChangedEventArgs>;

    /**
     * initialize a the single new instance of Lingualizer
     */
    private constructor ()
    {
        this._onLocaleChanged = new EventDispatcher<Lingualizer, LocaleChangedEventArgs>();
        this._locale = Lingualizer.DefaultLocale;
        this.initTranslations();
    }

    public static get default (): Lingualizer
    {
        if ( Lingualizer._instance == null )
            Lingualizer._instance = new Lingualizer();

        //TODO: look for and read in `.lingualizerrc settings
        return Lingualizer._instance;
    }

    /**
     * subscribe to get notified when the locale changes
     *
     * @readonly
     * @type {IEvent<Lingualizer, LocaleChangedEventArgs>} gives the Lingualizer instance that raised the event and a object containing the old and new locales
     * @memberof Lingualizer
     */
    public get onLocaleChanged (): IEvent<Lingualizer, LocaleChangedEventArgs>
    {
        return this._onLocaleChanged.asEvent();
    }

    /**
     * set the current locale. will trigger the `localeChanged` event so subscribers
     * can get translations from the newly set locale
     *
     * @memberof Lingualizer
     */
    public set locale ( locale: Locale )
    {
        let oldLocale = this._locale;
        if ( oldLocale == locale )
            return;

        this._locale = locale;
        this.initTranslations( oldLocale );

        //console.log( `set locale to ${ this._locale }` );
    }

    /**
     * gets the currently set locale. will return `null` if locale has not been set
     * and can assume to use default locale
     *
     * @type {Locale}
     * @memberof Lingualizer
     */
    public get locale (): Locale
    {
        return this._locale;
    }

    /**
     * get a keys value from translated locale or default locale if non-default locale is set and the key cannot be found
     *
     * @author tsimper
     * @date 2019-01-24
     * @param {string} key the name of the string to look up
     * @returns {string} the tranlated string or default if no translation found or default locale set and if no default returns null
     * @memberof Lingualizer
     */
    public get ( key: string ): string
    {
        if ( this._defaultLocaleTranslations == null && this._translations == null )
            return '';

        let value: string = null;
        if ( this.locale !== Lingualizer.DefaultLocale && this._translations !== null )
        {
            let getVal = getValue( this._translations, key );
            if ( typeof getVal !== 'undefined' )
            {
                return getVal;
            }
        }

        // allways try to return the string from default tranlation file even if cant find a translated one
        if ( this._defaultLocaleTranslations !== null )
        {
            let getVal = getValue( this._defaultLocaleTranslations, key );

            if ( typeof getVal !== 'undefined' )
                value = getVal;
        }

        return value;
    }

    /**
     * set `_translations` to json read from translations.json file according to the currently set locale
     *
     * @author tsimper
     * @date 2019-01-15
     * @export
     * @returns 
     */
    public initTranslations ( oldLocale: Locale = this._locale )
    {
        let translationsPath = getLocalizationDirectory();
        if ( !fse.existsSync( translationsPath ) )
            throw new Error( format( this._errorMessages[ 0 ], translationsPath ) );

        let defaultFile: string = path.join( translationsPath, `${ getLocalizationFileName() }.${ Lingualizer.DefaultranslationFileExt }` );
        let localeFile: string = path.join( translationsPath, `${ getLocalizationFileName() }.${ this.locale }.${ Lingualizer.DefaultranslationFileExt }` );


        // allways try load the default locale translations as we dish them if translated cant be found and it's the most common
        //  as in what would be loaded at starup only changing if set locale to non-default
        if ( fse.existsSync( defaultFile ) )
        {
            this._defaultLocaleTranslations = JSON.parse( fse.readFileSync( defaultFile, "utf8" ) );
            this._onLocaleChanged.dispatch( this, { oldLocale: oldLocale, newLocale: this._locale } );
        }
        else
        {
            if ( this.locale == Lingualizer.DefaultLocale )
                throw new Error( format( this._errorMessages[ 1 ], this._locale, defaultFile ) );
        }


        if ( this.locale !== Lingualizer.DefaultLocale )
        // try load non-default locale
        {
            if ( fse.existsSync( localeFile ) )
            {
                this._translations = JSON.parse( fse.readFileSync( localeFile, "utf8" ) );
                this._onLocaleChanged.dispatch( this, { oldLocale: oldLocale, newLocale: this._locale } );
            } else
            {
                //console.log( `${ terminalPrefix } requested locale translation file cannot be found.` );
                throw new Error( format( this._errorMessages[ 1 ], this._locale, defaultFile ) );
            }
        }
    }

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
    static updateDefaults ( configu?: any ): any
    {
        let config = configu || configrc;
        if ( config == null )
            return;

        if ( config.defaultLocale )
            Lingualizer.DefaultLocale = config.defaultLocale;

        if ( config.defaulLocalizationDirName )
            Lingualizer.DefaulLocalizationDirName = config.defaulLocalizationDirName;

        if ( config.defaultranslationFileName )
            Lingualizer.DefaultranslationFileName = config.defaultranslationFileName;

        if ( config.defaultranslationFileExt )
            Lingualizer.DefaultranslationFileExt = config.defaultranslationFileExt;

        if ( config.cwd )
            Lingualizer.Cwd = config.cwd;

        return config;
    }

    /**
     * # for internal use
     *
     * @author tsimper
     * @date 2019-01-18
     * @static
     * @returns 
     * @memberof Lingualizer
     */
    static printDefaults ()
    {
        console.log( chalk.gray( `${ app } ${ chalk.bold.green( 'Default Settings' ) } locale: ${ chalk.cyan( Lingualizer.DefaultLocale ) } directory: ${ chalk.cyan( Lingualizer.DefaulLocalizationDirName ) } file: ${ chalk.cyan( getLocalizationFileName() ) } ext: '${ chalk.cyan( Lingualizer.DefaultranslationFileExt ) }'` ) );
    }
}


