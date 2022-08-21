import { ipcMain, IpcMainEvent } from 'electron';
import log from 'electron-log';
import MainForm from '../mainform';

ipcMain.on('load_add_new_server_page', function (event: IpcMainEvent) {
    MainForm.win().loadFile('view/add_new_server.html');
    MainForm.win().webContents.once('did-finish-load', () => {
        log.info('load add new server page complete');
    });
});
