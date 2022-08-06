import { app, BrowserWindow } from 'electron';
import log from 'electron-log';
import fs from 'fs';

let win: BrowserWindow;

const createWindow = (pageName: string, fileName: string) => {
    win = new BrowserWindow({
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
        if (pageName == 'index') {
            send_ls();
        }
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

function send_ls() {
    const cwd = process.cwd();
    log.info('cwd = ' + cwd);

    fs.readdir(cwd, function (_err: Error | null, items: string[]) {
        log.info('err = ' + _err);
        const elements = new Array<string>();

        for (let i = 0; i < items.length; i++) {
            elements.push(items[i]);
        }

        win.webContents.send('ls', { cwd, elements });
    });
}
