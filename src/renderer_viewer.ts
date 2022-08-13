import { ipcRenderer } from 'electron';
import log from 'electron-log';
import util from 'util';
import path from 'path';

ipcRenderer.on('load_image', (_event, { cwd: cwd, filename: filename, index: index }) => {
    log.info(util.format('load_image(viewer): %s / %s / %d', cwd, filename, index));
    const canvas = document.getElementById('canvas') as HTMLImageElement;
    canvas.src = path.join(cwd, filename);
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function backToBrowser(): void {
    log.info('back to browser renderer');
    ipcRenderer.send('backToBrowser');
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function quit(): void {
    log.info('quit application');
    ipcRenderer.send('quit');
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function toggleFullscreen(): void {
    ipcRenderer.send('toggleFullscreen');
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function next(): void {
    ipcRenderer.send('next');
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function prev(): void {
    ipcRenderer.send('prev');
}
