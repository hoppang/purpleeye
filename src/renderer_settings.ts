import { ipcRenderer } from "electron";
import log from "electron-log";

const formSettings = document.querySelector('#form_settings');

formSettings?.addEventListener("submit", async function(event){
    event.preventDefault();   // stop the form from submitting
    let fullscreen_viewer = document.getElementById('fullscreen_viewer') as HTMLInputElement;
    log.info("formSettings submit " + fullscreen_viewer.checked);
    ipcRenderer.send('save_settings', { fullscreen_viewer: fullscreen_viewer.checked });
});
