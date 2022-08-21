import { ipcRenderer, IpcRendererEvent } from 'electron';
import log from 'electron-log';
import util from 'util';
import { ServerInfo } from '../managers/settings_manager';

ipcRenderer.on('ls-server', function (event: IpcRendererEvent, serverList: Array<ServerInfo>) {
    log.info('ls-server remote browser ' + serverList.length);
    let str = util.format(
        '<div class="listitem listitem_dir" onclick="addNewServer();"><a href="#">Add New Server</a></div>',
    );

    for (const server of serverList) {
        str = util.format('%s\n%s', str, serverItemStr(server.name, server.url, server.id));
    }

    log.info('str = ' + str);

    const content = document.getElementById('itemlist_content') as HTMLDivElement;
    content.innerHTML = str;
});

ipcRenderer.on('ls', function (_event, data: { cwd: string; elements: { dirs: Array<string>; files: Array<string> } }) {
    log.info('remote browser receives ls');
    const cwd = data.cwd;
    const dirs = data.elements.dirs;
    const files = data.elements.files;

    // 항상 상위 디렉토리는 표시
    let str = util.format('<div class="listitem listitem_dir" onclick="changeDir(\'..\');"><a href="#">..</a></div>');

    for (let i = 0; i < dirs.length; i++) {
        str = util.format('%s\n%s', str, dirItemStr(dirs[i]));
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

function dirItemStr(dirName: string): string {
    return util.format(
        '<div class="listitem listitem_dir" onclick="changeDir(\'%s\');"><a href="#">%s</a></div>',
        dirName,
        dirName,
    );
}

function serverItemStr(serverName: string, url: string, serverId: number) {
    return util.format(
        '<div class="listitem listitem_dir"><a href="#" onclick="connect(%d);">%s (%s)</a> <a href="#" class="edit_server" onclick="edit(%d);">edit</a> <a href="#" class="delete_server" onclick="deleteServer(%d);">delete</a></div>',
        serverId,
        serverName,
        url,
        serverId,
        serverId,
    );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function addNewServer(): void {
    log.info('addNewServer');
    ipcRenderer.send('load_add_new_server_page');
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function connect(serverId: number): void {
    log.info('connect ' + serverId);
    ipcRenderer.send('connect', serverId);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function deleteServer(serverId: number): void {
    log.info('delete ' + serverId);
    ipcRenderer.send('delete_server', serverId);
}
