export class LanguageConfig {
    private static _instance: LanguageConfig;
    private _selectedLang: string | undefined;

    private constructor() {
        //...
    }

    public set selectedLang(langId: string) {
        this._selectedLang = langId;
        // console.log("Setting language: ", langId);
    }

    public get selectedLang() {
        return this._selectedLang;
    };

    public static get Instance() {
        // Do you need arguments? Make it a regular method instead.
        return this._instance || (this._instance = new this());
    }
}
