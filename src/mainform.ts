import { BrowserWindow } from 'electron';

export default class MainForm {
    private _win: BrowserWindow;
    private static _instance: MainForm;

    private constructor() {
        this._win = new BrowserWindow({
            width: 1024,
            height: 768,
            minWidth: 800,
            minHeight: 600,
            icon: '../res/purpleeye_icon.png',
            // hack for 'require is not defined'
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
            },
        });
    }

    public static instance() {
        return this._instance || (this._instance = new MainForm());
    }

    public static win(): BrowserWindow {
        return this.instance()._win;
    }
}
