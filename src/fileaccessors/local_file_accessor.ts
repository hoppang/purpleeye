import log from 'electron-log';
import fs from 'fs';
import path from 'path';
import { FileAccessor } from '../interfaces/file_accessor';
import Util from '../util';
import { FileEntry, newFileEntry } from './file_entry';

export class LocalFileAccessor implements FileAccessor {
    private cursor: number;
    private entries: Array<FileEntry>;
    private dir: string;

    constructor() {
        this.cursor = 0;
        this.entries = new Array<FileEntry>();
        this.dir = '';
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    connect(url: string, username: string, filename: string) {
        log.info('LocalFileAccessor connect: do nothing');
    }

    readdirSync(dir: string, imagesOnly: boolean): Array<FileEntry> {
        const fileNames = fs.readdirSync(dir);
        this.dir = dir;
        this.entries = [];
        for (const fileName of fileNames) {
            try {
                const stat = fs.statSync(path.join(dir, fileName));
                if (imagesOnly) {
                    if (Util.isImage(fileName)) {
                        this.entries.push(newFileEntry(fileName, stat.isDirectory()));
                    }
                } else {
                    if (Util.isImage(fileName) || Util.isCBZ(fileName)) {
                        this.entries.push(newFileEntry(fileName, stat.isDirectory()));
                    }
                }
            } catch (e) {
                // do nothing
            }
        }

        return this.entries;
    }

    async getFileAsync(dir: string, filename: string): Promise<string> {
        return path.join(dir, filename);
    }

    getCursor(): number {
        return this.cursor;
    }

    getCurrentFileUrl(): string {
        return path.join(this.dir, this.entries[this.cursor].name);
    }

    getFilesCount(): number {
        return this.entries.length;
    }

    setCursorByFilename(filename: string): void {
        this.cursor = 0;
        for (let i = 0; i < this.entries.length; ++i) {
            const entry = this.entries[i];
            if (entry.name == filename) {
                this.cursor = i;
                break;
            }
        }
    }

    goto(index: number): void {
        this.cursor = index;
    }

    next(): void {
        this.cursor = (this.cursor + 1) % this.entries.length;
    }

    prev(): void {
        this.cursor = (this.cursor - 1 + this.entries.length) % this.entries.length;
    }
}
