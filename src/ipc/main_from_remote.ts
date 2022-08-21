import { ipcMain, IpcMainEvent } from 'electron';
import log from 'electron-log';
import MainForm from '../mainform';
import { SettingsManager } from '../managers/settings_manager';

ipcMain.on('load_add_new_server_page', function (event: IpcMainEvent) {
    MainForm.win().loadFile('view/form_server.html');
    MainForm.win().webContents.once('did-finish-load', () => {
        log.info('load add new server page complete');
    });
});

ipcMain.on(
    'add_server',
    function (
        event: IpcMainEvent,
        args: { server_name: string; server_url: string; username: string; password: string },
    ) {
        log.info('add server');
        SettingsManager.instance().addServer(args.server_name, args.server_url, args.username, args.password);
    },
);
