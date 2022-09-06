import { BrowserWindow } from 'electron';
import { LocalFileAccessor } from '../fileaccessors/local_file_accessor';
import { FileAccessor } from '../interfaces/file_accessor';
import { SettingsKey, SettingsManager } from '../managers/settings_manager';
import { Util } from '../util';

/**
 * 로컬 장치의 파일시스템에 접근
 */
class LocalBrowser {
    /**
     * 현재 디렉토리
     */
    private _cwd: string;
    private dirs: Array<string>;
    private files: Array<string>;
    private readonly _win: BrowserWindow;
    private fileAccessor: FileAccessor;

    constructor(win: BrowserWindow) {
        this.dirs = new Array<string>();
        this.files = new Array<string>();
        this._cwd = process.cwd();
        this._win = win;
        this.fileAccessor = new LocalFileAccessor();
    }

    loadIndexPage(isLaunch: boolean): void {
        this._win.loadFile('view/index.html');
        this._win.webContents.once('did-finish-load', () => {
            this._cwd = process.cwd();
            this.ls(this._cwd);

            if (isLaunch && SettingsManager.instance().getBoolean(SettingsKey.REMEMBER_LAST_DIR)) {
                const lastDir = SettingsManager.instance().getString(SettingsKey.LAST_DIR);
                if (lastDir != null && lastDir.length > 0) {
                    this._cwd = lastDir;
                }
            }

            this.chdir(this._cwd, true);
        });
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

    chdir(newdir: string, doList: boolean) {
        process.chdir(newdir);
        this._cwd = process.cwd();
        if (doList) {
            this.ls(this._cwd);
            this._win.webContents.send('ls', { cwd: this._cwd, elements: { dirs: this.dirs, files: this.files } });
        }
    }

    /**
     * 지정한 디렉토리의 파일 목록을 읽고 내부 변수를 업데이트한다.
     * @param path 대상 디렉토리
     * @returns
     */
    private ls(path: string): void {
        this.dirs = [];
        this.files = [];

        const entries = this.fileAccessor.readdirSync(path, false);
        for (const entry of entries) {
            try {
                if (entry.isDirectory && !Util.isHidden(entry.name)) {
                    this.dirs.push(entry.name);
                } else if ((Util.isImage(entry.name) || Util.isCBZ(entry.name)) && !Util.isHidden(entry.name)) {
                    this.files.push(entry.name);
                }
            } catch (e) {
                // do nothing
            }
        }
    }
}

export default LocalBrowser;
