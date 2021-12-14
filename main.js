const {
    app,
    BrowserWindow,
    Menu
} = require('electron')
const path = require('path')
const url = require('url')
const shell = require('electron').shell
const ipc = require('electron').ipcMain
const fs = require('fs');

var win = null

function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({
        show:false,
        width: 1500,
        height: 800,
        icon: path.join(__dirname, 'assets/icons/png/BTC_icon.png'),
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true
        }
    })
    win.once('ready-to-show',()=>{
        win.show()
    });
    // and load the index.html of the app.
    win.loadFile('src/index.html')

    var menu = Menu.buildFromTemplate([{
            //label is like File, Edit, View up top. Each selection is a label
            //submenu consists of the items inside each label

            label: 'Menu',
            submenu: [

                {
                    label: 'Adjust Notification Value'
                },
                {
                    label: 'CoinMarketCap',
                    click() {
                        shell.openExternal('http://coinmarketcap.com')
                    }
                },
                {
                    type: 'separator'
                },
                {
                    label: 'Exit',
                    click() {
                        app.quit()
                    }
                },
                {
                    label: 'Restart',
                    click() {
                        app.exit();
                        app.relaunch()
                    }
                }

            ]
        },
        {
            label: 'Menu2',
            submenu: [{
                    label: 'I am'
                },
                {
                    label: 'just here'
                },
                {
                    label: 'to show'
                },
                {
                    label: 'how to create'
                },
                {
                    label: 'another Menu'
                }
            ]
        }
    ])

    Menu.setApplicationMenu(menu);
    // Open the DevTools.
    win.webContents.openDevTools()

}



// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow)

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

/*
    inter process communication(IPC). Allows communication between windows/proccesses.
    Two different types of processess. ipcMain and ipcRenderer.
    ipcMain recieves data from ipcRenderers and sends it back to the windows of those ipcRenderers
    ipc catches the message sent from add.html and send that value back to win, which is bound to index.html.

    When ipc recieves a value for 'update-notify-value', it will trigger the function, passing in the updated value.
    That updated value is sent off inside the function to win as the var targetPriceVal
*/

ipc.on('update-notify-value', function(event, arg) {
    win.webContents.send('newTargetPrice', arg) //sends the update-notify-value to targetPriceVal as an argument

})

ipc.on('form-submission', function(event, cryptoCurrency, newTargetPrice){
    win.webContents.send('newTargetPrice', cryptoCurrency, newTargetPrice);
})

var rawdata = fs.readFileSync("./assets/Update_Values.json");
var data = JSON.parse(rawdata);
module.exports.getData=()=>data;
