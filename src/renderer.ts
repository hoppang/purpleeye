import { ipcRenderer } from 'electron';

ipcRenderer.on('ls', (_event, _data) => {
    const list = Array.from(_data);
    let str = '';

    for (let i = 0; i < list.length; i++) {
        str = str.concat('<p>' + list[i] + '</p>');
    }

    const content = document.getElementById('itemlist_content') as HTMLDivElement;
    content.innerHTML = str;
});
