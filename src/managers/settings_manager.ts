import { app } from 'electron';
import log from 'electron-log';
import settings from 'electron-settings';

const SettingsKey = {
    FULLSCREEN_VIEWER: 'fullscreen_viewer',
    QUIT_FULLSCREEN_WHEN_BACK: 'quit_fullscreen_when_back',
    REMEMBER_LAST_DIR: 'remember_last_dir',
    LAST_DIR: 'last_dir',
};

class ServerInfo {
    public name!: string;
    public url!: string;
    public username!: string;
    public password!: string;
}

/**
 * 설정 관리 클래스. 싱글턴
 */
class SettingsManager {
    private static _instance: SettingsManager;
    private constructor() {
        log.debug('init settings manager');
        if (this.getString(SettingsKey.LAST_DIR) === undefined) {
            this.setString(SettingsKey.LAST_DIR, app.getPath('home'));
        }
    }

    public static instance() {
        return this._instance || (this._instance = new SettingsManager());
    }

    loadServerList(): Array<ServerInfo> {
        return new Array<ServerInfo>();
    }

    clear(): void {
        log.info('clear settings');
        this.setBoolean(SettingsKey.FULLSCREEN_VIEWER, false);
        this.setBoolean(SettingsKey.QUIT_FULLSCREEN_WHEN_BACK, false);
        this.setBoolean(SettingsKey.REMEMBER_LAST_DIR, false);
        this.setString(SettingsKey.LAST_DIR, app.getPath('home'));
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

export { SettingsKey, ServerInfo, SettingsManager };
