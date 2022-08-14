import { BrowserWindow } from "electron";

export default class MainForm {
    private _win: BrowserWindow;

    constructor() {
        this._win = new BrowserWindow({
            width: 1024,
            height: 768,
            minWidth: 800,
            minHeight: 600,
            // hack for 'require is not defined'
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
            },
        });
    }

    win(): BrowserWindow {
        return this._win;
    }
}
