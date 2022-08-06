import { ipcRenderer } from 'electron';
import { FileEntry } from './browser';

ipcRenderer.on('ls', function (_event, data: { cwd: string; elements: Array<FileEntry> }) {
    const cwd = data.cwd;
    const elements = data.elements;

    let str = '<table style="border: 2px;">';
    for (let i = 0; i < elements.length; i++) {
        if (elements[i].isDirectory) {
            str = str.concat('<tr><td><b>DIR</b> ' + elements[i].name + '</td></tr>');
        } else {
            str = str.concat('<tr><td>' + elements[i].name + '</td></tr>');
        }
    }

    str = str.concat('</table>');

    const header = document.getElementById('itemlist_header') as HTMLDivElement;
    header.innerText = cwd;

    const content = document.getElementById('itemlist_content') as HTMLDivElement;
    content.innerHTML = str;
});
