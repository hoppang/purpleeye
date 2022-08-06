import { app, ipcMain } from 'electron';
import log from 'electron-log';
import { Browser } from './browser';

let browser: Browser;

app.whenReady().then(() => {
    log.info('arguments: ' + process.argv);
    browser = new Browser();

    if (process.argv.length == 3) {
        log.info('load viewer page');
        browser.loadViewerPage(process.argv[2]);
    } else {
        log.info('load index page');
        browser.loadIndexPage();
    }
});

ipcMain.on('cd', (_event, dirname: string) => {
    log.info('cd to ' + dirname);
    browser.chdir(dirname);
});

ipcMain.on('view', (_event, filepath: string) => {
    log.info('view ' + filepath);
    browser.loadViewerPage(filepath);
});

ipcMain.on('backToBrowser', (_event: Electron.Event) => {
    log.info('back to browser main');
    browser.loadIndexPage();
});
