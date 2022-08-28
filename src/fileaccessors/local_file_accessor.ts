import fs from 'fs';
import path from 'path';
import { FileAccessor } from '../interfaces/file_accessor';
import { FileEntry, newFileEntry } from './file_entry';

export class LocalFileAccessor implements FileAccessor {
    readdirSync(dir: string): Array<FileEntry> {
        const fileNames = fs.readdirSync(dir);
        let entries: Array<FileEntry> = new Array<FileEntry>();
        for (const fileName of fileNames) {
            const stat = fs.statSync(path.join(dir, fileName));
            entries.push(newFileEntry(fileName, stat.isDirectory()));
        }

        return entries;
    }
}
