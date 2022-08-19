import { ipcRenderer } from 'electron';
import log from 'electron-log';
import util from 'util';

const formSettings = document.querySelector('#form_settings');
const fullscreenViewer = document.getElementById('fullscreen_viewer') as HTMLInputElement;
const quitFullscreenWhenBack = document.getElementById('quit_fullscreen_when_back') as HTMLInputElement;
const rememberLastDir = document.getElementById('remember_last_dir') as HTMLInputElement;

document.addEventListener('DOMContentLoaded', pageLoaded);

function pageLoaded() {
    log.info('pageLoaded');
    ipcRenderer.send('settings_ready');
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
fullscreenViewer.addEventListener('change', (e) => {
    quitFullscreenWhenBack.disabled = !fullscreenViewer.checked;
});

formSettings?.addEventListener('submit', (event) => {
    event.preventDefault(); // stop the form from submitting
    log.info('formSettings submit ' + fullscreenViewer.checked);
    ipcRenderer.send('save_settings', {
        fullscreenViewer: fullscreenViewer.checked,
        quitFullscreenWhenBack: quitFullscreenWhenBack.checked,
        rememberLastDir: rememberLastDir.checked,
    });
});

ipcRenderer.on('response_settings_ready', (event, params) => {
    log.info('response_settings_ready: ' + JSON.stringify(params));
    fullscreenViewer.checked = params.isFullscreenViewer;
    quitFullscreenWhenBack.checked = params.quitFullscreenWhenBack;
    quitFullscreenWhenBack.disabled = !fullscreenViewer.checked;
    rememberLastDir.checked = params.rememberLastDir;

    const cacheInfo = document.getElementById('cache_info') as HTMLDivElement;
    cacheInfo.innerHTML = util.format('cache size: [%d]', params.tempDirSize);
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function backToBrowser() {
    ipcRenderer.send('back_to_browser');
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function clearSettings() {
    ipcRenderer.send('clear_settings');
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function clearCache() {
    ipcRenderer.send('clear_cache');
}
