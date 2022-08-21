import { app, BrowserWindow } from 'electron';
import log from 'electron-log';
import settings from 'electron-settings';
import sqlite3, { RunResult } from 'sqlite3';

const SettingsKey = {
    FULLSCREEN_VIEWER: 'fullscreen_viewer',
    QUIT_FULLSCREEN_WHEN_BACK: 'quit_fullscreen_when_back',
    REMEMBER_LAST_DIR: 'remember_last_dir',
    LAST_DIR: 'last_dir',
};

class ServerInfo {
    public id!: number;
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

        this.db = new sqlite3.Database('settings.db', (err: Error | null) => {
            if (err) {
                log.error(err);
            } else {
                log.info('init db');
                this.db.run(
                    'create table if not exists servers (id integer primary key autoincrement, name text, url text, username text, password text)',
                );
            }
        });
    }

    public static instance() {
        return this._instance || (this._instance = new SettingsManager());
    }

    private db: sqlite3.Database;

    loadServerList(win: BrowserWindow, messageName: string): void {
        log.info('loadServerList');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.db.all('select * from servers', (err: Error | null, rows: any[]) => {
            if (err) {
                log.error(err);
            } else {
                const serverList: Array<ServerInfo> = [];
                for (const row of rows) {
                    log.info(row);
                    serverList.push({
                        id: row.id,
                        name: row.name,
                        url: row.url,
                        username: row.username,
                        password: row.password,
                    });
                }

                log.info('serverList: ' + serverList);
                win.webContents.send(messageName, serverList);
            }
        });
    }

    /**
     * DB에 저장된 서버 정보를 ID 기준으로 읽어서 가져온다.
     * @param id 서버 ID
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getServer(id: number, callback: (err: Error | null, row: any) => void): void {
        this.db.get('select * from servers where id = ?', [id], callback);
    }

    /**
     * 원격 서버 목록에 새 항목을 추가한다.
     * @param server_name 서버 이름
     * @param server_url URL
     * @param username 유저명(ID)
     * @param password 비밀번호
     */
    addServer(server_name: string, server_url: string, username: string, password: string) {
        this.db.run(
            'insert into servers (name, url, username, password) values (?, ?, ?, ?)',
            [server_name, server_url, username, password],
            (result: RunResult, err: Error | null) => {
                if (err) {
                    log.error(err);
                } else {
                    log.info('result = ' + result + ' err = ' + err);
                }
            },
        );
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
