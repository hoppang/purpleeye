import { FileEntry } from '../fileaccessors/file_entry';

export interface FileAccessor {
    // 연결
    connect(url: string, username: string, password: string): void;

    /**
     * 디렉토리 정보를 읽는다.
     * @param dir 대상 디렉토리
     * @param imagesOnly 이미지 아카이브(cbz) 를 목록에 포함할 것인가 말 것인가
     */
    readdirSync(dir: string, imagesOnly: boolean): Array<FileEntry>;

    // 정보 얻기
    getFileAsync(dir: string, filename: string): Promise<string>;
    getCursor(): number;
    getCurrentFileUrl(): string;
    getFilesCount(): number;

    // 커서 이동
    goto(pageNo: number): void;
    prev(): void;
    next(): void;
    setCursorByFilename(filename: string): void;
}
