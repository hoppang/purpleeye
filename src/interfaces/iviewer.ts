import { WebContents } from 'electron';

interface IViewer {
    init(cwd: string, filename: string, fullscreen: boolean): void;
    goto(sender: WebContents, pageNo: number): void;
    next(): void;
    prev(): void;
    toggleFullscreen(): void;
    quit(): void;
}

export default IViewer;
