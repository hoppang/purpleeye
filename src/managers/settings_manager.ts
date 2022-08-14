import log from 'electron-log';
import settings from 'electron-settings';

class SettingsManager {
    private static _instance: SettingsManager;
    private constructor() {
        log.debug('init settings manager');
    }

    public static instance() {
        return this._instance || (this._instance = new SettingsManager());
    }

    isFullscreenViewer(): boolean {
        const value = settings.getSync('fullscreenViewer');
        return value?.valueOf() as boolean;
    }

    setFullscreenViewer(value: boolean): void {
        log.info('setFullscreenViewer: ' + value);
        settings.setSync('fullscreenViewer', value);
    }

    quitFullscreenWhenBack(): boolean {
        return settings.getSync('quitFullscreenWhenBack')?.valueOf() as boolean;
    }

    setQuitFullscreenWhenBack(value: boolean): void {
        settings.setSync('quitFullscreenWhenBack', value);
    }

    isRememberLastDir(): boolean {
        return settings.getSync('rememberLastDir')?.valueOf() as boolean;
    }

    setRememberLastDir(value: boolean) {
        settings.setSync('rememberLastDir', value);
    }

    getLastDir(): string {
        return settings.getSync('lastDir')?.valueOf() as string;
    }

    setLastDir(dir: string): void {
        log.info("SET LAST DIR: " + dir);
        settings.setSync('lastDir', dir);
    }
}

export default SettingsManager;
