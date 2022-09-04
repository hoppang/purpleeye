import { FileEntry } from '../fileaccessors/file_entry';

export interface FileAccessor {
    connect(url: string, username: string, password: string): void;
    readdirSync(dir: string): Array<FileEntry>;
    getFileAsync(dir: string, filename: string): Promise<string>;
}
