import { WebContents } from 'electron';

export interface Viewer {
    init(cwd: string, filename: string, fullscreen: boolean): void;
    goto(sender: WebContents, pageNo: number): void;
    next(): void;
    prev(): void;
    toggleFullscreen(): void;
    quit(): void;
}
