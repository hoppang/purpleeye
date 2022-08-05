import { ipcRenderer } from 'electron';

ipcRenderer.on('load_image', (_event, fileName) => {
    var canvas = document.getElementById('canvas') as HTMLImageElement;
    canvas.src = fileName;
});
