import { FileEntry, newFileEntry } from '../fileaccessors/file_entry';

export interface FileAccessor {
    readdirSync(dir: string): Array<FileEntry>;
}
