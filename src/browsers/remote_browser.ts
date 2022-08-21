import log from 'electron-log';
import { FileStat, createClient, ResponseDataDetailed, WebDAVClient } from 'webdav';
import MainForm from '../mainform';
import { SettingsManager, ServerInfo } from '../managers/settings_manager';

/**
 * 원격 서버의 파일 목록에 접근
 */
class RemoteBrowser {
    private static _instance: RemoteBrowser;
    private constructor() {
        this.serverInfo = undefined;
        this.client = undefined;
    }

    public static instance() {
        return this._instance || (this._instance = new RemoteBrowser());
    }

    private serverInfo: ServerInfo | undefined;
    private client: WebDAVClient | undefined;

    loadIndexPage(): void {
        MainForm.win().loadFile('view/remote.html');
        MainForm.win().webContents.once('did-finish-load', () => {
            SettingsManager.instance().loadServerList(MainForm.win(), 'ls-server');
        });
    }

    connect(server: ServerInfo): void {
        this.serverInfo = server;
        this.client = createClient(server.url, {
            username: server.username,
            password: server.password,
        });
    }

    ls(dir: string): void {
        // Get directory contents
        if (this.client != undefined) {
            this.client
                .getDirectoryContents(dir, { details: false })
                .then((contents: FileStat[] | ResponseDataDetailed<FileStat[]>) => {
                    if (Array.isArray(contents)) {
                        const dirs: string[] = [];
                        const files: string[] = [];

                        for (const item of contents) {
                            log.info('directoryItems = ' + item.filename);
                            dirs.push(item.filename);
                        }

                        MainForm.win().webContents.send('ls', { cwd: '/', elements: { dirs: dirs, files: files } });
                    }
                });
        }
    }
}

export { RemoteBrowser };
