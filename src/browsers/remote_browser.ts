import log from 'electron-log';
import { FileStat, createClient, ResponseDataDetailed } from 'webdav';
import MainForm from '../mainform';
import { SettingsManager, ServerInfo } from '../managers/settings_manager';

/**
 * 원격 서버의 파일 목록에 접근
 */
class RemoteBrowser {
    private static _instance: RemoteBrowser;
    private constructor() {
    }

    public static instance() {
        return this._instance || (this._instance = new RemoteBrowser());
    }

    loadIndexPage(): void {
        MainForm.win().loadFile('view/remote.html');
        MainForm.win().webContents.once('did-finish-load', () => {
            const serverList: Array<ServerInfo> = SettingsManager.instance().loadServerList();
            MainForm.win().webContents.send('ls-server', serverList);
        });
    }

export { RemoteBrowser };
