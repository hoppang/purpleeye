import { app, ipcMain, IpcMainEvent } from 'electron';
import log from 'electron-log';
import { Browser } from './browser';
import { FILE_TYPE, Util } from './util';
import IViewer from './viewer/iviewer';
import ImageViewer from './viewer/image_viewer';
import CBZViewer from './viewer/cbz_viewer';
import { SettingsKey, SettingsManager } from './managers/settings_manager';
import MainForm from './mainform';
import path from 'path';

require('./ipc/main_from_settings');

let main: MainForm;
let viewer: IViewer;
let browser: Browser;
const initOpenFileQueue: string[] = [];

app.whenReady().then(async () => {
    log.info('arguments: ' + process.argv);
    main = new MainForm();
    browser = new Browser(main.win());

    if (initOpenFileQueue.length > 0) {
        const cwd = path.dirname(initOpenFileQueue[0]);
        const filename = path.basename(initOpenFileQueue[0]);
        initViewer({ cwd: cwd, filename: filename });
    }
});

app.on('will-finish-launching', () => {
    app.on('open-file', (event, file) => {
        if (app.isReady() === false) {
            initOpenFileQueue.push(file);
        } else {
            const cwd = path.dirname(file);
            const filename = path.basename(file);
            initViewer({ cwd: cwd, filename: filename });
        }
        event.preventDefault();
    });
});

app.on('will-quit', () => {
    if (SettingsManager.instance().getBoolean(SettingsKey.REMEMBER_LAST_DIR)) {
        SettingsManager.instance().setString(SettingsKey.LAST_DIR, browser.cwd());
    }
});

function initViewer(parameter: { cwd: string; filename: string }) {
    const fileType = Util.getFileType(parameter.filename);

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

    browser.chdir(parameter.cwd, false);
    viewer.init(
        parameter.cwd,
        parameter.filename,
        SettingsManager.instance().getBoolean(SettingsKey.FULLSCREEN_VIEWER),
    );
}

ipcMain.on('cd', (_event, dirname: string) => {
    log.info('cd to ' + dirname);
    browser.chdir(dirname, true);
});

ipcMain.on('view', (_event, parameter: { cwd: string; filename: string }) => {
    initViewer(parameter);
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
ipcMain.on('back_to_browser', (event: IpcMainEvent) => {
    log.info('back to browser main');
    browser.loadIndexPage(false);
    if (
        SettingsManager.instance().getBoolean(SettingsKey.FULLSCREEN_VIEWER) &&
        SettingsManager.instance().getBoolean(SettingsKey.QUIT_FULLSCREEN_WHEN_BACK)
    ) {
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
