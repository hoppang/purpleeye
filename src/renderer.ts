import { ipcRenderer } from 'electron';
import util from 'util';

ipcRenderer.on('ls', function (_event, data: { cwd: string; elements: { dirs: Array<string>; files: Array<string> } }) {
    const cwd = data.cwd;
    const dirs = data.elements.dirs;
    const files = data.elements.files;

    let str = '<table style="border: 2px;">';
    // 항상 상위 디렉토리는 표시
    str = util.format(
        '%s\n<tr><td><a href="#" class="listitem_dir" onclick="changeDir(\'..\');">..</a></td></tr>',
        str,
    );

    for (let i = 0; i < dirs.length; i++) {
        str = util.format(
            '%s\n<tr><td><a href="#" class="listitem_dir" onclick="changeDir(\'%s\');">%s</a></td></tr>',
            str,
            dirs[i],
            dirs[i],
        );
    }

    for (let i = 0; i < files.length; i++) {
        str = util.format(
            '%s\n<tr><td><a href="#" class="listitem_file" onclick="view(\'%s\', \'%s\');">%s</a></td></tr>',
            str,
            cwd,
            files[i],
            files[i],
        );
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
    ipcRenderer.send('view', { cwd: cwd, filename: filename });
}
