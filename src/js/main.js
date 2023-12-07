const electron = require('electron')
const $ = require('jquery');

const app = electron.app
const BrowserWindow = electron.BrowserWindow

let mainWindow

app.on('ready', _ => {
    mainWindow = new BrowserWindow({
        height: 900,
        width: 500
    })

    mainWindow.openDevTools()

    mainWindow.loadURL(`file://${__dirname}/../index.html`)

    mainWindow.on('closed', _ => {
        mainWindow = null
    })
})