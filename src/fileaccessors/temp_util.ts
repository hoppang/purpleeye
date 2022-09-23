import { app } from 'electron';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import log from 'electron-log';
import { SettingsManager } from '../managers/settings_manager';

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

    static generateUrl(dir: string, filename: string): string {
        const outFilename = crypto.createHash('sha256').update(path.join(dir, filename)).digest('hex');

        return path.join(this.getTempDir(), outFilename);
    }

    static deleteOldCaches(days: number) {
        const expiration = SettingsManager.instance().getCacheExpires();
        const e = new Date();
        const dir = this.getTempDir();
        const entries = fs.readdirSync(dir);
        e.setDate(e.getDate() - expiration);

        for (const file of entries) {
            const stat = fs.statSync(path.join(this.getTempDir(), file));
            if (e > stat.mtime) {
                fs.unlinkSync(path.join(dir, file));
            }
        }
    }
}
