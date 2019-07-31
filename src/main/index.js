const { app, BrowserWindow, ipcMain } = require('electron');

require('electron-reload')(__dirname);

let mainWindow;

let createWindow = async () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        //frame: false,
        webPreferences: {
            nodeIntegration: true
        }
    });

    mainWindow.on('closed', function () {
        mainWindow = null;
    });

    await mainWindow.loadFile('index.html');

    ipcMain.on('message', (event, arg) => {
        console.log(event, arg);
    });
};

app.on('ready', createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin')
        app.quit();
});

app.on('activate', async () => {
    if (mainWindow === null)
        await createWindow();
});