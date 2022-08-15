import { ipcMain, IpcMainEvent } from 'electron';
import log from 'electron-log';
import { SettingsKey, SettingsManager } from '../managers/settings_manager';

ipcMain.on(
    'save_settings',
    (
        event: IpcMainEvent,
        params: { fullscreenViewer: boolean; quitFullscreenWhenBack: boolean; rememberLastDir: boolean },
    ) => {
        log.info('save settings: ' + JSON.stringify(params));
        SettingsManager.instance().setBoolean(SettingsKey.FULLSCREEN_VIEWER, params.fullscreenViewer);
        SettingsManager.instance().setBoolean(SettingsKey.QUIT_FULLSCREEN_WHEN_BACK, params.quitFullscreenWhenBack);
        SettingsManager.instance().setBoolean(SettingsKey.REMEMBER_LAST_DIR, params.rememberLastDir);
    },
);

ipcMain.on('settings_ready', (event: IpcMainEvent) => {
    log.info('settings ready');
    const isFullscreenViewer = SettingsManager.instance().getBoolean(SettingsKey.FULLSCREEN_VIEWER);
    const quitFullscreenWhenBack = SettingsManager.instance().getBoolean(SettingsKey.QUIT_FULLSCREEN_WHEN_BACK);
    const rememberLastDir = SettingsManager.instance().getBoolean(SettingsKey.REMEMBER_LAST_DIR);

    event.sender.send('response_settings_ready', { isFullscreenViewer, quitFullscreenWhenBack, rememberLastDir });
});
