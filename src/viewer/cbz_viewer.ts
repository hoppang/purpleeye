import { Viewer } from '../interfaces/viewer';
import { BrowserWindow, WebContents } from 'electron';
import StreamZip from 'node-stream-zip';
import path from 'path';
import crypto from 'crypto';
import Util from '../util';
import log from 'electron-log';
import { TempUtil } from '../fileaccessors/temp_util';

export default class CBZViewer implements Viewer {
    private _zipPath?: string;
    private _zip?: StreamZip;
    private _win: BrowserWindow;
    private _entries: Array<StreamZip.ZipEntry>;
    private _cursor: number;

    constructor(win: BrowserWindow) {
        this._entries = [];
        this._cursor = 0;
        this._win = win;
    }

    init(cwd: string, filename: string, fullscreen: boolean): void {
        this._win.loadFile('view/viewer.html');
        this._win.setFullScreen(fullscreen);
        this._zipPath = path.join(cwd, filename);
        this._zip = new StreamZip({ file: this._zipPath, storeEntries: true });

        this._zip.on('ready', () => this.onLoadCBZ());
    }

    private onLoadCBZ(): void {
        if (this._zip != undefined) {
            for (const entry of Object.values(this._zip.entries())) {
                if (entry.isDirectory === false && Util.isImage(entry.name)) {
                    this._entries.push(entry);
                }
            }

            this._win.webContents.once('did-finish-load', () => {
                this.extract();
            });
        }
    }

    private extract(): void {
        TempUtil.makeTempDir();

        if (this._entries.length == 0) {
            log.error('no entries in cbz');
            this._win.webContents.send('no_image_in_cbz');
            return;
        }

        const index = this._cursor;
        const entryName = this._entries[index].name;
        // 확장자를 안 붙여도 제대로 읽긴 하는데, 파일 타입 처리에 추가 시간이 소요되는지 확인 필요
        const outputFile = crypto
            .createHash('sha256')
            .update(this._zipPath + entryName)
            .digest('hex');
        const entryOut = path.join(TempUtil.getTempDir(), outputFile);

        if (TempUtil.existsFile(outputFile)) {
            log.info('cached file exists');
            this._win.webContents.send('load_image', {
                url: entryOut,
                index: this._cursor,
                maxPage: this._entries.length,
            });
        } else {
            log.info('cached file not exists. extracting...');
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            this._zip?.extract(entryName, entryOut, (err: any) => {
                if (err == undefined) {
                    this._win.webContents.send('load_image', {
                        url: entryOut,
                        index: this._cursor,
                        maxPage: this._entries.length,
                    });
                }
            });
        }
    }

    goto(sender: WebContents, pageNo: number): void {
        this._cursor = pageNo;
        this.extract();
    }

    next(): void {
        this._cursor = this.nextIndexOf(this._cursor);
        this.extract();
    }

    prev(): void {
        this._cursor = this.prevIndexOf(this._cursor);
        this.extract();
    }

    toggleFullscreen() {
        this._win.setFullScreen(!this._win.isFullScreen());
    }

    quit() {
        this._win.close();
    }

    private nextIndexOf(cursor: number) {
        return (cursor + 1) % this._entries.length;
    }

    private prevIndexOf(cursor: number) {
        return (cursor - 1 + this._entries.length) % this._entries.length;
    }
}
