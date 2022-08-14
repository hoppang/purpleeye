import { BrowserWindow, WebContents } from 'electron';
import fs from 'fs';
import IViewer from './iviewer';
import Util from '../util';

class ImageViewer implements IViewer {
    private readonly _win: BrowserWindow;
    private _files: Array<string>;
    private _cursor: number;
    private _cwd?: string;

    constructor(win: BrowserWindow) {
        this._win = win;
        this._files = [];
        this._cursor = 0;
    }

    init(cwd: string, filename: string, fullscreen: boolean): void {
        this._cwd = cwd;
        this.buildFilesList(cwd, filename);
        this._win.loadFile('view/viewer.html');
        this._win.setFullScreen(fullscreen);
        this._win.webContents.once('did-finish-load', () => {
            this._win.webContents.send('load_image', {
                cwd: cwd,
                filename: filename,
                index: this._cursor,
                maxPage: this._files.length,
            });
        });
    }

    goto(sender: WebContents, pageNo: number): void {
        this._cursor = pageNo;
        sender.send('load_image', {
            cwd: this._cwd,
            filename: this._files[this._cursor],
            index: this._cursor,
            maxPage: this._files.length,
        });
    }

    next(): void {
        this._cursor = this.nextIndexOf(this._cursor);
        this._win.webContents.send('load_image', {
            cwd: this._cwd,
            filename: this._files[this._cursor],
            index: this._cursor,
            maxPage: this._files.length,
        });
    }

    prev(): void {
        this._cursor = this.prevIndexOf(this._cursor);
        this._win.webContents.send('load_image', {
            cwd: this._cwd,
            filename: this._files[this._cursor],
            index: this._cursor,
            maxPage: this._files.length,
        });
    }

    toggleFullscreen(): void {
        this._win.setFullScreen(!this._win.isFullScreen());
    }

    quit() {
        this._win.close();
    }

    private buildFilesList(cwd: string, filename: string): void {
        const entries = fs.readdirSync(cwd);
        this._files = [];

        for (let i = 0; i < entries.length; i++) {
            const name = entries[i];

            try {
                if (Util.isImage(name) && !Util.isHidden(name)) {
                    this._files.push(name);
                }
            } catch (e) {
                // do nothing
            }
        }

        this._cursor = this._files.indexOf(filename);
    }

    private nextIndexOf(cursor: number): number {
        return (cursor + 1) % this._files.length;
    }

    private prevIndexOf(cursor: number): number {
        return (cursor + this._files.length - 1) % this._files.length;
    }
}

export default ImageViewer;
