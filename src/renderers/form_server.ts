import { ipcRenderer } from 'electron';
import log from 'electron-log';

const formAddServer = document.getElementById('form_add_server') as HTMLFormElement;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
formAddServer.addEventListener('submit', (event: SubmitEvent) => {
    const server_name = document.getElementById('server_name') as HTMLInputElement;
    const server_url = document.getElementById('server_url') as HTMLInputElement;
    const username = document.getElementById('username') as HTMLInputElement;
    const password = document.getElementById('password') as HTMLInputElement;

    if (server_name.value === '' || server_url.value === '' || username.value === '' || password.value === '') {
        alert('Please fill all fields');
        return;
    }

    log.info('add server confirm');
    ipcRenderer.send('add_server', {
        server_name: server_name.value,
        server_url: server_url.value,
        username: username.value,
        password: password.value,
    });
});
