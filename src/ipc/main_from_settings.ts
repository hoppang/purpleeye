import { ipcMain, IpcMainEvent } from "electron";
import log from "electron-log";
import SettingsManager from "../managers/settings_manager";

ipcMain.on(
    'save_settings',
    (event: IpcMainEvent, params: { fullscreenViewer: boolean; quitFullscreenWhenBack: boolean, rememberLastDir: boolean }) => {
        log.info('save settings: ' + JSON.stringify(params));
        SettingsManager.instance().setFullscreenViewer(params.fullscreenViewer);
        SettingsManager.instance().setQuitFullscreenWhenBack(params.quitFullscreenWhenBack);
        SettingsManager.instance().setRememberLastDir(params.rememberLastDir);
    },
);

ipcMain.on('settings_ready', (event: IpcMainEvent) => {
    log.info('settings ready');
    const isFullscreenViewer = SettingsManager.instance().isFullscreenViewer();
    const quitFullscreenWhenBack = SettingsManager.instance().quitFullscreenWhenBack();
    const rememberLastDir = SettingsManager.instance().isRememberLastDir();

    event.sender.send('response_settings_ready', { isFullscreenViewer, quitFullscreenWhenBack, rememberLastDir });
});
