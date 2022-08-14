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
}

export default SettingsManager;
