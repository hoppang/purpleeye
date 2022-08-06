import fs from 'fs';

type FileEntry = {
    name: string;
    isDirectory: boolean;
};

class Browser {
    ls(path: string): Array<FileEntry> {
        const files = fs.readdirSync(path);
        const result = new Array<FileEntry>();

        for (let i = 0; i < files.length; i++) {
            const filename = files[i];
            const is_dir = fs.statSync(path + '/' + filename).isDirectory();
            result.push({ name: filename, isDirectory: is_dir });
        }
        return result;
    }
}

export { Browser, FileEntry };
