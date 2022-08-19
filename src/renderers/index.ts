import { ipcRenderer } from 'electron';
import util from 'util';

ipcRenderer.on('ls', function (_event, data: { cwd: string; elements: { dirs: Array<string>; files: Array<string> } }) {
    const cwd = data.cwd;
    const dirs = data.elements.dirs;
    const files = data.elements.files;

    let str = '';
    // 항상 상위 디렉토리는 표시
    str = util.format(
        '%s\n<div class="listitem listitem_dir" onclick="changeDir(\'..\');"><a href="#">..</a></div>',
        str,
    );

    for (let i = 0; i < dirs.length; i++) {
        str = util.format(
            '%s\n<div class="listitem listitem_dir" onclick="changeDir(\'%s\');"><a href="#">%s</a></div>',
            str,
            dirs[i],
            dirs[i],
        );
    }

    for (let i = 0; i < files.length; i++) {
        str = util.format(
            '%s\n<div class="listitem listitem_file" onclick="view(\'%s\', \'%s\');"><a href="#">%s</a></div>',
            str,
            cwd,
            files[i],
            files[i],
        );
    }

    const header = document.getElementById('itemlist_cwd') as HTMLDivElement;
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
