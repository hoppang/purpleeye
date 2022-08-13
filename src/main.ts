import { app, BrowserWindow, ipcMain } from 'electron';
import log from 'electron-log';
import { Browser } from './browser';
import ImgViewer from './imgviewer';
import util from 'util';
import { FILE_TYPE, getFileType } from './filetype_util';

let main: Main;
let browser: Browser;
let imageViewer: ImgViewer;

app.whenReady().then(() => {
    log.info('arguments: ' + process.argv);
    main = new Main();
    browser = new Browser(main.win());
    imageViewer = new ImgViewer(main.win());

    if (process.argv.length == 3) {
        log.info('load viewer page');
        browser.setIndex(browser.getIndexOf(process.argv[2]));
        imageViewer.load(process.cwd(), process.argv[2]);
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

    let fileType = getFileType(parameter.filename);
    log.info('fileType: ' + fileType);

    switch(fileType) {
        case FILE_TYPE.CBZ:
            // implement
            break;
        case FILE_TYPE.IMAGE:
            browser.setIndex(browser.getIndexOf(parameter.filename));
            imageViewer.load(parameter.cwd, parameter.filename);
            break;
        default:
            break;
    }
});

ipcMain.on('backToBrowser', (_event: Electron.Event) => {
    log.info('back to browser main');
    browser.loadIndexPage();
});

ipcMain.on('next', (_event: Electron.Event) => {
    browser.next();
});

ipcMain.on('toggleFullscreen', (_event: Electron.Event) => {
    browser.toggleFullscreen();
});

ipcMain.on('prev', (_event: Electron.Event) => {
    browser.prev();
});

ipcMain.on('quit', (_event: Electron.Event) => {
    browser.quit();
});

