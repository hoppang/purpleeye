import { ipcRenderer } from 'electron';

ipcRenderer.on('ls', function (_event, data: { cwd: string; elements: Array<string> }) {
    const cwd = data.cwd;
    const list = Array.from(data.elements);
    let str = '<table style="border: 2px;">';

    for (let i = 0; i < list.length; i++) {
        str = str.concat('<tr><td>' + list[i] + '</td></tr>');
    }

    str = str.concat('</table>');

    const header = document.getElementById('itemlist_header') as HTMLDivElement;
    header.innerText = cwd;

    const content = document.getElementById('itemlist_content') as HTMLDivElement;
    content.innerHTML = str;
});
