import { app, ipcMain, IpcMainEvent } from 'electron';
import log from 'electron-log';
import path from 'path';
import fs from 'fs';
import fastFolderSize from 'fast-folder-size';
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

    const tempDir = path.join(app.getPath('temp'), 'purpleeye');

    fastFolderSize(tempDir, (err: Error | null, size: number | undefined) => {
        if (err != null) {
            log.error(err);
        } else {
            const tempDirSize: number = size || 0;
            event.sender.send('response_settings_ready', {
                isFullscreenViewer,
                quitFullscreenWhenBack,
                rememberLastDir,
                tempDir,
                tempDirSize,
            });
        }
    });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
ipcMain.on('clear_settings', (event: IpcMainEvent) => {
    SettingsManager.instance().clear();
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
ipcMain.on('clear_cache', (event: IpcMainEvent) => {
    const tempDir = path.join(app.getPath('temp'), 'purpleeye');
    fs.readdir(tempDir, (err, files) => {
        if (err) throw err;

        for (const file of files) {
            fs.unlink(path.join(tempDir, file), (err) => {
                if (err) throw err;
            });
        }
    });
});
