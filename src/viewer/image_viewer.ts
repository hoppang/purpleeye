import { BrowserWindow, WebContents } from 'electron';
import { Viewer } from '../interfaces/viewer';
import { FileAccessor } from '../interfaces/file_accessor';
import { LocalFileAccessor } from '../fileaccessors/local_file_accessor';
import { WebdavFileAccessor } from '../fileaccessors/webdav_file_accessor';

class ImageViewer implements Viewer {
    private readonly _win: BrowserWindow;
    private fileAccessor: FileAccessor;

    constructor(win: BrowserWindow, type: string) {
        this._win = win;
        if (type == 'local') {
            this.fileAccessor = new LocalFileAccessor();
        } else {
            this.fileAccessor = new WebdavFileAccessor();
            this.fileAccessor.connect(
                'https://hsbb.asuscomm.com:40443/remote.php/dav/files/hoppang/',
                'hoppang',
                'ghQkdslan9(',
            );
        }
    }

    init(cwd: string, filename: string, fullscreen: boolean): void {
        this.fileAccessor.readdirSync(cwd, true);
        this.fileAccessor.setCursorByFilename(filename);
        this._win.loadFile('view/viewer.html');
        this._win.setFullScreen(fullscreen);
        this._win.webContents.once('did-finish-load', async () => {
            const url: string = await this.fileAccessor.getFileAsync(cwd, filename);
            this._win.webContents.send('load_image', {
                url: url,
                index: this.fileAccessor.getCursor(),
            });
        });
    }

    goto(sender: WebContents, pageNo: number): void {
        this.fileAccessor.goto(pageNo);
        sender.send('load_image', {
            url: this.fileAccessor.getCurrentFileUrl(),
            index: this.fileAccessor.getCursor(),
            maxPage: this.fileAccessor.getFilesCount(),
        });
    }

    next(): void {
        this.fileAccessor.next();
        this._win.webContents.send('load_image', {
            url: this.fileAccessor.getCurrentFileUrl(),
            index: this.fileAccessor.getCursor(),
            maxPage: this.fileAccessor.getFilesCount(),
        });
    }

    prev(): void {
        this.fileAccessor.prev();
        this._win.webContents.send('load_image', {
            url: this.fileAccessor.getCurrentFileUrl(),
            index: this.fileAccessor.getCursor(),
            maxPage: this.fileAccessor.getFilesCount(),
        });
    }

    toggleFullscreen(): void {
        this._win.setFullScreen(!this._win.isFullScreen());
    }

    quit() {
        this._win.close();
    }
}

export default ImageViewer;
