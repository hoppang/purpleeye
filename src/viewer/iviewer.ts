interface IViewer {
    init(cwd: string, filename: string): void;
    next(): void;
    prev(): void;
    toggleFullscreen(): void;
    quit(): void;
}

export default IViewer;
