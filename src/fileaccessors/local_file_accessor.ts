import log from 'electron-log';
import fs from 'fs';
import path from 'path';
import { FileAccessor } from '../interfaces/file_accessor';
import { FileEntry, newFileEntry } from './file_entry';

export class LocalFileAccessor implements FileAccessor {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    connect(url: string, username: string, filename: string) {
        log.info('LocalFileAccessor connect: do nothing');
    }

    readdirSync(dir: string): Array<FileEntry> {
        const fileNames = fs.readdirSync(dir);
        const entries: Array<FileEntry> = new Array<FileEntry>();
        for (const fileName of fileNames) {
            try {
                const stat = fs.statSync(path.join(dir, fileName));
                entries.push(newFileEntry(fileName, stat.isDirectory()));
            } catch (e) {
                // do nothing
            }
        }

        return entries;
    }

    async getFileAsync(dir: string, filename: string): Promise<string> {
        return path.join(dir, filename);
    }
}
