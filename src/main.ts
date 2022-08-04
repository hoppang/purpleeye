const { app, BrowserWindow } = require('electron')
const log = require('electron-log');

const createWindow = () => {
    const win = new BrowserWindow({
      width: 800,
      height: 600
    })

    win.loadFile('view/index.html')
}

app.whenReady().then(() => {
    log.info("arguments: " + process.argv);
    createWindow();
})
