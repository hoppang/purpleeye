import log from "electron-log";

const FILE_TYPE = {
    CBZ: 1,
    IMAGE: 2,
    UNKNOWN: 9999
}

function getFileType(filename: string): number {
    const ext = filename.split('.').pop();
    if (ext != undefined) {
        log.info("ext = " + ext);
    }

    switch (ext?.toLowerCase()) {
        case 'cbz':
            return FILE_TYPE.CBZ;
        case 'jpg':
        case 'jpeg':
        case 'png':
            return FILE_TYPE.IMAGE;
        default:
            return FILE_TYPE.UNKNOWN;
    }
}

export { FILE_TYPE, getFileType };
