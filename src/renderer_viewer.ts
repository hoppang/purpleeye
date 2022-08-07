import { ipcRenderer } from 'electron';
import log from 'electron-log';

ipcRenderer.on('load_image', (_event, fileName) => {
    const canvas = document.getElementById('canvas') as HTMLImageElement;
    canvas.src = fileName;
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function backToBrowser(): void {
    log.info('back to browser renderer');
    ipcRenderer.send('backToBrowser');
}

function quit(): void {
    log.info('quit application');
    ipcRenderer.send('quit');
}
