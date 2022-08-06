import { ipcRenderer } from 'electron';
import { FileEntry } from './browser';
import util from 'util';

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
            str = str.concat('<tr><td>' + elements[i].name + '</td></tr>');
        }
    }

    str = str.concat('</table>');

    const header = document.getElementById('itemlist_header') as HTMLDivElement;
    header.innerText = cwd;

    const content = document.getElementById('itemlist_content') as HTMLDivElement;
    content.innerHTML = str;
});

function changeDir(dirname: string) {
    ipcRenderer.send('cd', dirname);
}

// 사실 밖에서 안 쓰지만, no-unused-var 에러를 방지하기 위해 작성함.
// eslint directive comment가 먹히지 않는 이유를 모르겠음.
export { changeDir };
