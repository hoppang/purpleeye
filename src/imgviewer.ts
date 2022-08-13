import { BrowserWindow } from 'electron';
import path from 'path';

class ImgViewer {
    private readonly _win: BrowserWindow;

    constructor(win: BrowserWindow) {
        this._win = win;
    }

    load(cwd: string, filename: string) {
        this._win.loadFile('view/viewer.html');
        this._win.webContents.once('did-finish-load', () => {
            this._win.webContents.send('load_image', { cwd: cwd, filename: filename });
        });
    }
}

export default ImgViewer;
