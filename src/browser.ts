import { BrowserWindow } from 'electron';
import log from 'electron-log';
import fs from 'fs';

type FileEntry = {
    name: string;
    isDirectory: boolean;
};

class Browser {
    private win: BrowserWindow;

    constructor() {
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
            const list = this.ls(cwd);
            this.win.webContents.send('ls', { cwd, elements: list });
        });
    }

    loadViewerPage(filePath: string): void {
        this.win.loadFile('view/viewer.html');
        this.win.webContents.once('did-finish-load', () => {
            log.info('send loadImage message to renderer: ' + filePath);
            this.win.webContents.send('load_image', filePath);
        });
    }

    chdir(newdir: string) {
        process.chdir(newdir);
        const cwd = process.cwd();
        const list = this.ls(cwd);
        this.win.webContents.send('ls', { cwd, elements: list });
    }

    toggleFullscreen(): void {
        this.win.setFullScreen(!this.win.fullScreen);
    }

    quit() {
        this.win.close();
    }

    private ls(path: string): [Array<string>, Array<string>] {
        const entries = fs.readdirSync(path);
        const dirs = new Array<string>();
        const files = new Array<string>();

        for (let i = 0; i < entries.length; i++) {
            const name = entries[i];

            const is_dir = fs.statSync(path + '/' + name).isDirectory();
            if (is_dir && !this.is_hidden(name)) {
                dirs.push(name);
            }
            else if (this.is_image(name) && !this.is_hidden(name)) {
                files.push(name);
            }
        }
        return [dirs, files];
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
}

export { Browser, FileEntry };
