import { app, ipcMain } from 'electron';
import log from 'electron-log';
import { Browser } from './browser';
import util from 'util';

let browser: Browser;

app.whenReady().then(() => {
    log.info('arguments: ' + process.argv);
    browser = new Browser();

    if (process.argv.length == 3) {
        log.info('load viewer page');
        browser.initViewerPage(process.argv[2]);
    } else {
        log.info('load index page');
        browser.loadIndexPage();
    }
});

ipcMain.on('cd', (_event, dirname: string) => {
    log.info('cd to ' + dirname);
    browser.chdir(dirname);
});

ipcMain.on('view', (_event, parameter: { cwd: string; filename: string }) => {
    log.info(util.format('view [url] %s [filename] %s', parameter.cwd, parameter.filename));
    browser.loadViewerPage(parameter.cwd, parameter.filename);
});

ipcMain.on('backToBrowser', (_event: Electron.Event) => {
    log.info('back to browser main');
    browser.loadIndexPage();
});

ipcMain.on('toggleFullscreen', (_event: Electron.Event) => {
    browser.toggleFullscreen();
});

ipcMain.on('next', (_event: Electron.Event) => {
    browser.next();
});

ipcMain.on('prev', (_event: Electron.Event) => {
    browser.prev();
});

ipcMain.on('quit', (_event: Electron.Event) => {
    browser.quit();
});
