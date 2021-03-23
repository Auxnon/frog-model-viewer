const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const fs= require('fs')

if (app.isPackaged) {
  // workaround for missing executable argument)
  process.argv.unshift(null)
}
// parameters is now an array containing any files/folders that your OS will pass to your application
let parameters = [process.argv.slice(2)]
let mainWindow;

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  if(!mainWindow){
    mainWindow=win;
    mainWindow.on('close', function(e){
      mainWindow=undefined;
    })
  }

  win.loadFile('public/index.html')
}

app.on('open-file', (event,path) => {
  parameters.push(path)
  if(mainWindow)
      mainWindow.webContents.send("client", parameters);
  event.preventDefault();
})


app.whenReady().then(() => {
  /*protocol.registerFileProtocol('atom', (request, callback) => {
    const url = request.url.substr(7)
    callback({ path: path.normalize(`${__dirname}/${url}`) })
  })

  protocol.registerStringProtocol(scheme, handler)*/
  createWindow()


  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
ipcMain.on('synchronous-message', (event, arg) => {
  console.log(arg)
  event.returnValue = 'big baluye'
})


ipcMain.on("server", (event, args) => {
  /*fs.readFile("path/to/file", (error, data) => {
    // Do something with file contents

    // Send result back to renderer process
    win.webContents.send("client", responseObj);
  });*/
  if(args=="check" && mainWindow)
    mainWindow.webContents.send("client", parameters);

  console.log(args)
});