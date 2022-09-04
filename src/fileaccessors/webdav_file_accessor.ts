import { FileAccessor } from '../interfaces/file_accessor';
import { FileEntry } from './file_entry';
import { createClient, WebDAVClient } from 'webdav';
import path from 'path';
import log from 'electron-log';
import { TempUtil } from './temp_util';
import util from 'util';
import Stream from 'stream';
import fs from 'fs';

export class WebdavFileAccessor implements FileAccessor {
    private client: WebDAVClient | undefined;

    constructor() {
        this.client = undefined;
    }

    connect(url: string, username: string, password: string): void {
        this.client = createClient(url, {
            username: username,
            password: password,
        });
    }

    // todo: 구현하기
    readdirSync(dir: string): Array<FileEntry> {
        log.debug('readdirSync: ' + dir);
        const entries: Array<FileEntry> = new Array<FileEntry>();
        return entries;
    }

    /**
     * 파일 다운로드하고 다운로드된 위치 리턴. Sync처럼 동작하는 Async
     * @param dir 디렉토리
     * @param filename 파일이름
     * @returns 다운로드받은 파일 url
     */
    async getFileAsync(dir: string, filename: string): Promise<string> {
        const srcUrl = path.join(dir, filename);
        const saveUrl = TempUtil.generateUrl(dir, filename);
        log.info(util.format('srcUrl [%s] saveUrl [%s]', srcUrl, saveUrl));

        const readStream: Stream.Readable | undefined = this.client?.createReadStream(srcUrl);
        readStream?.pipe(fs.createWriteStream(saveUrl));

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        return new Promise((resolve, reject) => {
            readStream?.on('end', () => {
                log.info('webdav download finished');
                resolve(saveUrl);
            });
        });
    }
}
