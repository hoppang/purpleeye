import { ipcRenderer } from 'electron';
import log from 'electron-log';
import util from 'util';

document.addEventListener('mousewheel', (event: Event) => {
    const deltaY = (<WheelEvent>event).deltaY;

    if (deltaY > 0) {
        next();
    } else if (deltaY < 0) {
        prev();
    }
});

ipcRenderer.on('load_image', (_event, { url: url, index: index, maxPage: maxPage }) => {
    log.info(util.format('load_image(viewer): %s', url));
    const canvas = document.getElementById('canvas') as HTMLImageElement;
    canvas.src = url;

    const indicator = document.getElementById('pageIndicator') as HTMLDivElement;
    indicator.innerHTML = util.format('%d / %d', index + 1, maxPage);

    const pageSlider = document.getElementById('pageSlider') as HTMLInputElement;
    pageSlider.max = util.format('%d', maxPage - 1);
    pageSlider.value = util.format('%d', index);
});

ipcRenderer.on('no_image_in_cbz', () => {
    log.error('no image in cbz (viewer renderer)');
    const container = document.getElementById('img-container') as HTMLDivElement;
    container.innerHTML = 'no image in cbz';
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function onChangeSlider() {
    const slider = document.getElementById('pageSlider') as HTMLInputElement;
    ipcRenderer.send('goto', parseInt(slider.value));
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function backToBrowser(): void {
    log.info('back to browser renderer');
    ipcRenderer.send('back_to_browser');
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

function next(): void {
    ipcRenderer.send('next');
}

function prev(): void {
    ipcRenderer.send('prev');
}
