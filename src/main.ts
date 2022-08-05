import { app, BrowserWindow } from 'electron';
import log from 'electron-log';

const createWindow = (pageName: string, fileName: string) => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        // hack for 'require is not defined'
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    win.loadFile('view/' + pageName + '.html');
    win.webContents.once('did-finish-load', () => {
        if (pageName == 'viewer') {
            log.info('send loadImage message to renderer: ' + fileName);
            win.webContents.send('load_image', fileName);
        }
    });
};

app.whenReady().then(() => {
    log.info('arguments: ' + process.argv);
    if (process.argv.length == 3) {
        log.info('load viewer page');
        createWindow('viewer', process.argv[2]);
    } else {
        log.info('load index page');
        createWindow('index', 'test');
    }
});
