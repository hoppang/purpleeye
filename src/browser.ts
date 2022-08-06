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
            if (is_dir == true || this.is_image(filename)) {
                result.push({ name: filename, isDirectory: is_dir });
            }
        }
        return result;
    }

    is_image(path: string): boolean {
        const extension = path.split('.').pop();

        switch (extension?.toLowerCase()) {
            case 'jpg':
            case 'jpeg':
                return true;
            default:
                return false;
        }
    }
}

export { Browser, FileEntry };
