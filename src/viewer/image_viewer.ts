import { BrowserWindow, WebContents } from 'electron';
import { Viewer } from '../interfaces/viewer';
import Util from '../util';
import { FileAccessor } from '../interfaces/file_accessor';
import { LocalFileAccessor } from '../fileaccessors/local_file_accessor';

class ImageViewer implements Viewer {
    private readonly _win: BrowserWindow;
    private files: Array<string>;
    private _cursor: number;
    private _cwd?: string;
    private fileAccessor: FileAccessor;

    constructor(win: BrowserWindow) {
        this._win = win;
        this.files = [];
        this._cursor = 0;
        this.fileAccessor = new LocalFileAccessor();
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
                maxPage: this.files.length,
            });
        });
    }

    goto(sender: WebContents, pageNo: number): void {
        this._cursor = pageNo;
        sender.send('load_image', {
            cwd: this._cwd,
            filename: this.files[this._cursor],
            index: this._cursor,
            maxPage: this.files.length,
        });
    }

    next(): void {
        this._cursor = this.nextIndexOf(this._cursor);
        this._win.webContents.send('load_image', {
            cwd: this._cwd,
            filename: this.files[this._cursor],
            index: this._cursor,
            maxPage: this.files.length,
        });
    }

    prev(): void {
        this._cursor = this.prevIndexOf(this._cursor);
        this._win.webContents.send('load_image', {
            cwd: this._cwd,
            filename: this.files[this._cursor],
            index: this._cursor,
            maxPage: this.files.length,
        });
    }

    toggleFullscreen(): void {
        this._win.setFullScreen(!this._win.isFullScreen());
    }

    quit() {
        this._win.close();
    }

    private buildFilesList(cwd: string, filename: string): void {
        const entries = this.fileAccessor.readdirSync(cwd);
        this.files = [];

        for (let i = 0; i < entries.length; i++) {
            const entry = entries[i];

            try {
                if (entry.isDirectory == false && Util.isImage(entry.name) && !Util.isHidden(entry.name)) {
                    this.files.push(entry.name);
                }
            } catch (e) {
                // do nothing
            }
        }

        this._cursor = this.files.indexOf(filename);
    }

    private nextIndexOf(cursor: number): number {
        return (cursor + 1) % this.files.length;
    }

    private prevIndexOf(cursor: number): number {
        return (cursor + this.files.length - 1) % this.files.length;
    }
}

export default ImageViewer;
