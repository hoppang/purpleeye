import { app, BrowserWindow, ipcMain, IpcMainEvent } from 'electron';
import log from 'electron-log';
import settings from "electron-settings";
import { Browser } from './browser';
import util from 'util';
import { FILE_TYPE, Util } from './util';
import IViewer from './viewer/iviewer';
import ImageViewer from './viewer/image_viewer';
import CBZViewer from './viewer/cbz_viewer';

let main: Main;
let viewer: IViewer;
let browser: Browser;

app.whenReady().then(async () => {
    log.info('arguments: ' + process.argv);
    main = new Main();

    browser = new Browser(main.win());

    if (process.argv.length == 3) {
        log.info('load viewer page');
        var fullscreen = false;
        if (await settings.get('fullscreen_viewer.enabled') === true) {
            fullscreen = true;
        }

        switch(Util.getFileType(process.argv[2])) {
            case FILE_TYPE.IMAGE:
                viewer = new ImageViewer(main.win());
                break;
            case FILE_TYPE.CBZ:
                viewer = new CBZViewer(main.win());
                break;
        }
        viewer.init(process.cwd(), process.argv[2], fullscreen);
    } else {
        log.info('load index page');
        browser.loadIndexPage();
    }
});

class Main {
    private _win: BrowserWindow;

    constructor() {
        this._win = new BrowserWindow({
            width: 1024,
            height: 768,
            minWidth: 800,
            minHeight: 600,
            // hack for 'require is not defined'
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
            },
        });
    }

    win(): BrowserWindow {
        return this._win;
    }
}

ipcMain.on('cd', (_event, dirname: string) => {
    log.info('cd to ' + dirname);
    browser.chdir(dirname);
});

ipcMain.on('view', async (_event, parameter: { cwd: string; filename: string }) => {
    log.info(util.format('view [url] %s [filename] %s', parameter.cwd, parameter.filename));

    let fileType = Util.getFileType(parameter.filename);
    log.info('fileType: ' + fileType);

    switch(fileType) {
        case FILE_TYPE.CBZ:
            viewer = new CBZViewer(main.win());
            break;
        case FILE_TYPE.IMAGE:
            viewer = new ImageViewer(main.win());
            break;
        default:
            break;
    }

    var fullscreen = false;
    if (await settings.get('fullscreen_viewer.enabled') === true) {
        fullscreen = true;
    }

    viewer.init(parameter.cwd, parameter.filename, fullscreen);
});

ipcMain.on('backToBrowser', (_event: Electron.Event) => {
    log.info('back to browser main');
    browser.loadIndexPage();
});

ipcMain.on('goto', (event: IpcMainEvent, pageNo: number) => {
    viewer.goto(event.sender, pageNo);
});

ipcMain.on('next', (_event: Electron.Event) => {
    viewer.next();
});

ipcMain.on('prev', (_event: Electron.Event) => {
    viewer.prev();
});

ipcMain.on('toggleFullscreen', (_event: Electron.Event) => {
    viewer.toggleFullscreen();
});

// quit
ipcMain.on('quit', (_event: Electron.Event) => {
    viewer.quit();
});

ipcMain.on('save_settings', async (_event: Electron.Event, params: { fullscreen_viewer: boolean }) => {
    log.info("save settings: " + JSON.stringify(params));

    await settings.set('fullscreen_viewer',{
        enabled: params.fullscreen_viewer,
    });
});
