import { BrowserWindow } from 'electron';
import log from 'electron-log';
import fs from 'fs';

/**
 * 파일/디렉토리 목록 등을 관리하는 모듈
 */
class Browser {
    private _cwd: string;
    private dirs: Array<string>;
    private files: Array<string>;
    private index: number;
    private readonly _win: BrowserWindow;

    constructor(win: BrowserWindow) {
        this.dirs = new Array<string>();
        this.files = new Array<string>();
        this._cwd = process.cwd();
        this.index = 0;
        this._win = win;
    }

    loadIndexPage(): void {
        this._win.loadFile('view/index.html');
        this._win.webContents.once('did-finish-load', () => {
            this._cwd = process.cwd();
            this.ls(this._cwd);
            this._win.webContents.send('ls', { cwd: this._cwd, elements: { dirs: this.dirs, files: this.files } });
        });
    }

    getIndexOf(filename: string): number {
        if (this.files.length == 0) {
            this.ls(this._cwd);
        }

        return this.files.indexOf(filename);
    }

    chdir(newdir: string) {
        process.chdir(newdir);
        this._cwd = process.cwd();
        this.ls(this._cwd);
        this._win.webContents.send('ls', { cwd: this._cwd, elements: { dirs: this.dirs, files: this.files } });
    }

    toggleFullscreen(): void {
        this._win.setFullScreen(!this._win.fullScreen);
    }

    next(): void {
        this.index = this.getNextIndex(this.index);
        this._win.webContents.send('load_image', { cwd: this._cwd, filename: this.files[this.index], index: this.index });
    }

    prev(): void {
        this.index = this.getPrevIndex(this.index);
        this._win.webContents.send('load_image', { cwd: this._cwd, filename: this.files[this.index], index: this.index });
    }

    quit() {
        this._win.close();
    }

    /**
     * 지정한 디렉토리의 파일 목록을 읽고 내부 변수를 업데이트한다.
     * @param path 대상 디렉토리
     * @returns
     */
    private ls(path: string): void {
        const entries = fs.readdirSync(path);
        this.dirs = [];
        this.files = [];

        for (let i = 0; i < entries.length; i++) {
            const name = entries[i];

            try {
                const is_dir = fs.statSync(path + '/' + name).isDirectory();
                if (is_dir && !this.is_hidden(name)) {
                    this.dirs.push(name);
                } else if ((this.is_image(name) || this.is_comics_archive(name)) && !this.is_hidden(name)) {
                    this.files.push(name);
                }
            } catch (e) {
                // do nothing
            }
        }
    }

    setIndex(newIndex: number) {
        this.index = newIndex;
    }

    private is_hidden(filename: string): boolean {
        return filename.startsWith('.');
    }

    private is_image(path: string): boolean {
        const extension = path.split('.').pop();

        switch (extension?.toLowerCase()) {
            case 'jpg':
            case 'jpeg':
            case 'png':
                return true;
            default:
                return false;
        }
    }

    private is_comics_archive(path: string): boolean {
        const extension = path.split('.').pop();

        switch (extension?.toLowerCase()) {
            case 'cbz':
                return true;
            default:
                return false;
        }
    }

    private getNextIndex(index: number): number {
        if (index + 1 < this.files.length) {
            return index + 1;
        } else {
            return 0;
        }
    }

    private getPrevIndex(index: number): number {
        if (index - 1 >= 0) {
            return index - 1;
        } else {
            return this.files.length - 1;
        }
    }
}

export { Browser };
