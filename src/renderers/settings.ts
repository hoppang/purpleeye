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
    cacheInfo.innerHTML = util.format('cache size: [%s]', humanFileSize(params.tempDirSize));
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function onClickRemote() {
    ipcRenderer.send('load_remote_page');
}

/**
 * Format bytes as human-readable text.
 * from https://stackoverflow.com/questions/10420352/converting-file-size-in-bytes-to-human-readable-string
 *
 * @param bytes Number of bytes.
 * @param si True to use metric (SI) units, aka powers of 1000. False to use
 *           binary (IEC), aka powers of 1024.
 * @param dp Number of decimal places to display.
 *
 * @return Formatted string.
 */
function humanFileSize(bytes: number, si = false, dp = 1) {
    const thresh = si ? 1000 : 1024;

    if (Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }

    const units = si
        ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    let u = -1;
    const r = 10 ** dp;

    do {
        bytes /= thresh;
        ++u;
    } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);

    return bytes.toFixed(dp) + ' ' + units[u];
}
