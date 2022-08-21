import log from 'electron-log';
import { FileStat, createClient, ResponseDataDetailed, WebDAVClient } from 'webdav';
import path from 'path';
import MainForm from '../mainform';
import { SettingsManager, ServerInfo } from '../managers/settings_manager';

/**
 * 원격 서버의 파일 목록에 접근
 */
class RemoteBrowser {
    private static _instance: RemoteBrowser;
    private constructor() {
        this.client = undefined;
        this.cwd = '/';
    }

    public static instance() {
        return this._instance || (this._instance = new RemoteBrowser());
    }

    private client: WebDAVClient | undefined;
    private cwd: string;

    loadIndexPage(): void {
        MainForm.win().loadFile('view/remote.html');
        MainForm.win().webContents.once('did-finish-load', () => {
            SettingsManager.instance().loadServerList(MainForm.win(), 'ls-server');
        });
    }

    connect(server: ServerInfo): void {
        this.client = createClient(server.url, {
            username: server.username,
            password: server.password,
        });
        this.cwd = '/';
    }

    /**
     * WebDAV 클라이언트의 현재 디렉토리를 옮긴다.
     * WebDAV 클라이언트는 실제로 현재 디렉토리라는 게 없기 때문에 내부에서 cwd 변수를 바꿔준다.
     * @param sender
     * @param directory
     */
    cd(sender: Electron.WebContents, directory: string) {
        this.cwd = path.join(this.cwd, directory);
        this.ls(sender);
    }

    ls(sender: Electron.WebContents): void {
        // Get directory contents
        if (this.client != undefined) {
            this.client
                .getDirectoryContents(this.cwd, { details: false })
                .then((contents: FileStat[] | ResponseDataDetailed<FileStat[]>) => {
                    if (Array.isArray(contents)) {
                        const dirs: string[] = [];
                        const files: string[] = [];

                        for (const item of contents) {
                            log.info('directoryItems = ' + item.filename);
                            if (item.type === 'directory') {
                                dirs.push(item.filename);
                            } else {
                                files.push(item.filename);
                            }
                        }

                        sender.send('ls', { cwd: this.cwd, elements: { dirs: dirs, files: files } });
                    }
                });
        }
    }
}

export { RemoteBrowser };
