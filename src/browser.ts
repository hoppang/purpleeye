import { BrowserWindow } from 'electron';
import log from 'electron-log';
import fs from 'fs';
import SettingsManager from './managers/settings_manager';
import { Util } from './util';

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

        if (SettingsManager.instance().isRememberLastDir()) {
            this.chdir(SettingsManager.instance().getLastDir());
        }
    }

    getIndexOf(filename: string): number {
        if (this.files.length == 0) {
            this.ls(this._cwd);
        }

        return this.files.indexOf(filename);
    }

    cwd(): string {
        return this._cwd;
    }

    chdir(newdir: string) {
        process.chdir(newdir);
        this._cwd = process.cwd();
        this.ls(this._cwd);
        this._win.webContents.send('ls', { cwd: this._cwd, elements: { dirs: this.dirs, files: this.files } });
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
                if (is_dir && !Util.isHidden(name)) {
                    this.dirs.push(name);
                } else if ((Util.isImage(name) || Util.isCBZ(name)) && !Util.isHidden(name)) {
                    this.files.push(name);
                }
            } catch (e) {
                // do nothing
            }
        }
    }
}

export { Browser };
