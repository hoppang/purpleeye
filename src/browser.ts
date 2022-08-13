import { BrowserWindow } from 'electron';
import log from 'electron-log';
import fs from 'fs';

type FileEntry = {
    name: string;
    isDirectory: boolean;
};

class Browser {
    private win: BrowserWindow;
    private cwd: string;
    private dirs: Array<string>;
    private files: Array<string>;
    private index: number;

    constructor() {
        this.dirs = new Array<string>();
        this.files = new Array<string>();
        this.cwd = process.cwd();
        this.index = 0;

        this.win = new BrowserWindow({
            width: 800,
            height: 600,
            minWidth: 800,
            minHeight: 600,
            // hack for 'require is not defined'
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
            },
        });
    }

    loadIndexPage(): void {
        this.win.loadFile('view/index.html');
        this.win.webContents.once('did-finish-load', () => {
            const cwd = process.cwd();
            this.ls(cwd);
            this.win.webContents.send('ls', { cwd, elements: { dirs: this.dirs, files: this.files } });
        });
    }

    initViewerPage(filename: string): void {
        this.ls(process.cwd());
        this.win.webContents.send('load_image', { cwd: this.cwd, filename: filename, index: this.getIndex(filename) });
    }

    loadViewerPage(dir: string, filename: string): void {
        this.win.loadFile('view/viewer.html');
        this.win.webContents.once('did-finish-load', () => {
            if (this.cwd != dir) {
                this.ls(dir);
            }
            log.info('send loadImage message to renderer: ' + filename);
            this.win.webContents.send('load_image', { cwd: dir, filename: filename, index: this.getIndex(filename) });
        });
    }

    chdir(newdir: string) {
        process.chdir(newdir);
        this.cwd = process.cwd();
        this.ls(this.cwd);
        this.win.webContents.send('ls', { cwd: this.cwd, elements: { dirs: this.dirs, files: this.files } });
    }

    toggleFullscreen(): void {
        this.win.setFullScreen(!this.win.fullScreen);
    }

    next(): void {
        this.index = this.getNextIndex(this.index);
        this.win.webContents.send('load_image', { cwd: this.cwd, filename: this.files[this.index], index: this.index });
    }

    prev(): void {
        this.index = this.getPrevIndex(this.index);
        this.win.webContents.send('load_image', { cwd: this.cwd, filename: this.files[this.index], index: this.index });
    }

    quit() {
        this.win.close();
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

            const is_dir = fs.statSync(path + '/' + name).isDirectory();
            if (is_dir && !this.is_hidden(name)) {
                this.dirs.push(name);
            } else if (this.is_image(name) && !this.is_hidden(name)) {
                this.files.push(name);
            }
        }
    }

    private getIndex(filename: string): number {
        return this.files.indexOf(filename);
    }

    private is_hidden(filename: string): boolean {
        return filename.startsWith('.');
    }

    private is_image(path: string): boolean {
        const extension = path.split('.').pop();

        switch (extension?.toLowerCase()) {
            case 'jpg':
            case 'jpeg':
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

export { Browser, FileEntry };
