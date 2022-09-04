export type FileEntry = {
    name: string;
    isDirectory: boolean;
};

export function newFileEntry(name: string, isDirectory: boolean): FileEntry {
    return {
        name: name,
        isDirectory: isDirectory,
    };
}
