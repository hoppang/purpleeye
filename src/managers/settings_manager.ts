import log from 'electron-log';
import settings from 'electron-settings';

const SettingsKey = {
    FULLSCREEN_VIEWER: 'fullscreen_viewer',
    QUIT_FULLSCREEN_WHEN_BACK: 'quit_fullscreen_when_back',
    REMEMBER_LAST_DIR: 'remember_last_dir',
    LAST_DIR: 'last_dir',
}

class SettingsManager {
    private static _instance: SettingsManager;
    private constructor() {
        log.debug('init settings manager');
    }

    public static instance() {
        return this._instance || (this._instance = new SettingsManager());
    }

    getBoolean(key: string): boolean {
        return settings.getSync(key)?.valueOf() as boolean;
    }

    getString(key: string): string {
        return settings.getSync(key)?.valueOf() as string;
    }

    setBoolean(key: string, value: boolean): void {
        settings.setSync(key, value);
    }

    setString(key: string, value: string): void {
        settings.setSync(key, value);
    }
}

export { SettingsKey, SettingsManager };
