import { ipcRenderer } from 'electron';
import log from 'electron-log';

const formSettings = document.querySelector('#form_settings');
const fullscreenViewer = document.getElementById('fullscreen_viewer') as HTMLInputElement;
const quitFullscreenWhenBack = document.getElementById('quit_fullscreen_when_back') as HTMLInputElement;

fullscreenViewer.addEventListener('change', (e) => {
    quitFullscreenWhenBack.disabled = !fullscreenViewer.checked;
});

formSettings?.addEventListener('submit', async function (event) {
    event.preventDefault(); // stop the form from submitting
    log.info('formSettings submit ' + fullscreenViewer.checked);
    ipcRenderer.send('save_settings', { fullscreen_viewer: fullscreenViewer.checked });
});
