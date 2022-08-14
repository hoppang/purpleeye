import log from 'electron-log';

const FILE_TYPE = {
    CBZ: 1,
    IMAGE: 2,
    UNKNOWN: 9999,
};

class Util {
    static isImage(filename: string): boolean {
        switch (Util.getFileType(filename)) {
            case FILE_TYPE.IMAGE:
                return true;
            default:
                return false;
        }
    }

    static isHidden(filename: string): boolean {
        // todo: 나중에 윈도우 같은데서도 사용 가능하도록 코드 개선
        return filename.startsWith('.');
    }

    static isCBZ(filename: string): boolean {
        return Util.getFileType(filename) == FILE_TYPE.CBZ;
    }

    static getFileType(filename: string): number {
        const ext = filename.split('.').pop();
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
}

export { FILE_TYPE, Util };
export default Util;
