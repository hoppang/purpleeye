import { ipcRenderer } from 'electron';
import { FileEntry } from './browser';
import util from 'util';
import path from 'path';

ipcRenderer.on('ls', function (_event, data: { cwd: string; elements: Array<FileEntry> }) {
    const cwd = data.cwd;
    const elements = data.elements;

    let str = '<table style="border: 2px;">';
    // 항상 상위 디렉토리는 표시
    str = util.format('%s\n<tr><td><a href="#" onclick="changeDir(\'..\');">..</a></td></tr>', str);

    for (let i = 0; i < elements.length; i++) {
        if (elements[i].isDirectory) {
            str = util.format(
                '%s\n<tr><td><a href="#" onclick="changeDir(\'%s\');">%s</a></td></tr>',
                str,
                elements[i].name,
                elements[i].name,
            );
        } else {
            str = util.format(
                '%s\n<tr><td><a href="#" onclick="view(\'%s\', \'%s\');">%s</a></td></tr>',
                str,
                cwd,
                elements[i].name,
                elements[i].name,
            );
        }
    }

    str = str.concat('</table>');

    const header = document.getElementById('itemlist_header') as HTMLDivElement;
    header.innerText = cwd;

    const content = document.getElementById('itemlist_content') as HTMLDivElement;
    content.innerHTML = str;
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function changeDir(dirname: string) {
    ipcRenderer.send('cd', dirname);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function view(cwd: string, filename: string) {
    ipcRenderer.send('view', path.join(cwd, filename));
}
