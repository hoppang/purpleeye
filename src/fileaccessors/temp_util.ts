import { app } from 'electron';
import fs from 'fs';
import path from 'path';

export class TempUtil {
    /**
     * 앱의 임시 디렉토리 경로를 받아온다. 원격 모듈이라도 임시 디렉토리는 로컬에 있다.
     * @returns 임시 디렉토리 경로
     */
     static getTempDir(): string {
        return path.join(app.getPath('temp'), 'purpleeye');
     }

     /**
      * 임시 디렉토리가 존재하지 않으면 만든다. 원격 모듈이어도 임시 디렉토리는 로컬에 있다.
      */
     static makeTempDir(): void {
        if (!fs.existsSync(TempUtil.getTempDir())) {
            fs.mkdirSync(TempUtil.getTempDir());
        }
     }

     /**
      * 임시 디렉토리 안에 특정 파일이 있는지 체크.
      */
     static existsFile(fileName: string): boolean {
        const filePath: string = path.join(TempUtil.getTempDir(), fileName);
        return fs.existsSync(filePath);
     }
}
