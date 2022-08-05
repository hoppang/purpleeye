import { ipcRenderer } from 'electron';

ipcRenderer.on('load_image', (_event, fileName) => {
    const canvas = document.getElementById('canvas') as HTMLImageElement;
    canvas.src = fileName;
});
