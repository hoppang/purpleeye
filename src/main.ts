import { app, BrowserWindow, ipcMain, IpcMainEvent } from 'electron';
import log from 'electron-log';
import { Browser } from './browser';
import util from 'util';
import { FILE_TYPE, Util } from './util';
import IViewer from './viewer/iviewer';
import ImageViewer from './viewer/image_viewer';
import CBZViewer from './viewer/cbz_viewer';
import SettingsManager from './managers/settings_manager';

let main: Main;
let viewer: IViewer;
let browser: Browser;

app.whenReady().then(async () => {
    log.info('arguments: ' + process.argv);
    main = new Main();

    browser = new Browser(main.win());

    if (process.argv.length == 3) {
        log.info('load viewer page');

        switch (Util.getFileType(process.argv[2])) {
            case FILE_TYPE.IMAGE:
                viewer = new ImageViewer(main.win());
                break;
            case FILE_TYPE.CBZ:
                viewer = new CBZViewer(main.win());
                break;
        }
        viewer.init(process.cwd(), process.argv[2], SettingsManager.instance().isFullscreenViewer());
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

ipcMain.on('view', (_event, parameter: { cwd: string; filename: string }) => {
    log.info(util.format('view [url] %s [filename] %s', parameter.cwd, parameter.filename));

    const fileType = Util.getFileType(parameter.filename);
    log.info('fileType: ' + fileType);

    switch (fileType) {
        case FILE_TYPE.CBZ:
            viewer = new CBZViewer(main.win());
            break;
        case FILE_TYPE.IMAGE:
            viewer = new ImageViewer(main.win());
            break;
        default:
            break;
    }

    viewer.init(parameter.cwd, parameter.filename, SettingsManager.instance().isFullscreenViewer());
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
ipcMain.on('backToBrowser', (event: IpcMainEvent) => {
    log.info('back to browser main');
    browser.loadIndexPage();
    if (SettingsManager.instance().isFullscreenViewer() && SettingsManager.instance().quitFullscreenWhenBack()) {
        main.win().setFullScreen(false);
    }
});

ipcMain.on('goto', (event: IpcMainEvent, pageNo: number) => {
    viewer.goto(event.sender, pageNo);
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
ipcMain.on('next', (event: Electron.Event) => {
    viewer.next();
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
ipcMain.on('prev', (event: Electron.Event) => {
    viewer.prev();
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
ipcMain.on('toggleFullscreen', (event: Electron.Event) => {
    viewer.toggleFullscreen();
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
ipcMain.on('quit', (event: Electron.Event) => {
    viewer.quit();
});

ipcMain.on(
    'save_settings',
    (_event: Electron.Event, params: { fullscreenViewer: boolean; quitFullscreenWhenBack: boolean }) => {
        log.info('save settings: ' + JSON.stringify(params));
        SettingsManager.instance().setFullscreenViewer(params.fullscreenViewer);
        SettingsManager.instance().setQuitFullscreenWhenBack(params.quitFullscreenWhenBack);
    },
);

ipcMain.on('settings_ready', (event: IpcMainEvent) => {
    const isFullscreenViewer = SettingsManager.instance().isFullscreenViewer();
    const quitFullscreenWhenBack = SettingsManager.instance().quitFullscreenWhenBack();

    event.sender.send('response_settings_ready', { isFullscreenViewer, quitFullscreenWhenBack });
});
