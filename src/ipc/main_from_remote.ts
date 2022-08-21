import { ipcMain, IpcMainEvent } from 'electron';
import log from 'electron-log';
import { RemoteBrowser } from '../browsers/remote_browser';
import { ServerInfo, SettingsManager } from '../managers/settings_manager';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
ipcMain.on('connect', (event: IpcMainEvent, serverId: number) => {
    SettingsManager.instance().getServer(serverId, (err: Error | null, row: ServerInfo) => {
        if (err == null) {
            log.info('connect ok: ' + row.url);
            RemoteBrowser.instance().connect({
                id: row.id,
                name: row.name,
                url: row.url,
                username: row.username,
                password: row.password,
            });
            RemoteBrowser.instance().ls('/');
        } else {
            log.error(err);
            alert('Connect error: ' + err.message);
        }
    });
});

ipcMain.on('load_add_new_server_page', function (event: IpcMainEvent) {
    event.sender.loadFile('view/form_server.html');
    event.sender.once('did-finish-load', () => {
        log.info('load add new server page complete');
    });
});

ipcMain.on(
    'add_server',
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function (
        event: IpcMainEvent,
        args: { server_name: string; server_url: string; username: string; password: string },
    ) {
        log.info('add server');
        SettingsManager.instance().addServer(args.server_name, args.server_url, args.username, args.password);
    },
);
