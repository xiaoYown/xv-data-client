// Modules to control application life and create native browser window
const { app, BrowserWindow, BrowserView, ipcMain } = require('electron');
const path = require('path');

const navigator = require('./main-process/navigator')();

// 打开文件
const openFile = (event, { url }) => {
  const browserview = createBrowserView({ url })
  
  const nav = navigator.push({ view: browserview.view });
  mainWindow.webContents.send('navigatorPush', {
    id: nav.id
  })
  browserview.view.webContents.openDevTools({ mode: 'right' })
}

const webPreferences = {
  nodeIntegration: true,
  preload: path.join(__dirname, './resources/xv-sdk.js')
};

let mainWindow = null

// 初始化窗体
const createBrowserView = ({ name, url }) => {
  const view = new BrowserView({
    webPreferences,
    backgroundColor: '#1e1e1e'
  })
  const { width, height } = mainWindow.getContentBounds()
  // mainWindow.setBrowserView(view);
  mainWindow.addBrowserView(view);
  view.setBounds({
    x: 0,
    y: 40,
    // width: 800,
    width,
    height: height - 40
  })

  view.webContents.loadURL(url);
  // view.webContents.openDevTools({ mode: 'right' })
  // view.webContents.closeDevTools()

  return { name, view };
}

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    backgroundColor: '#1e1e1e',
    webPreferences
  })

  // and load the index.html of the app.
  // mainWindow.loadFile('./assets/edit/index.html')
  // mainWindow.webContents.loadURL('http://localhost:3010') // 初始页面
  // 加载主窗体容器
  mainWindow.loadFile('./index.html')
  // 打开初始化窗口
  // mainWindow.webContents.loadURL('http://localhost:3000/passid/edit')

  // const sdk = fs.readFileSync('./resources/xv-sdk.js').toString();
  // mainWindow.webContents.executeJavaScript(sdk);

  // mainWindow.webContents.executeJavaScript(`
  //   let basePath = process.cwd();
  //   console.log(basePath)
  //   window.XV = require(basePath + '//resources//xv-sdk.js');
  //   console.info('--executeJavaScript export Object --> ', window.XV);
  // `);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  mainWindow.on('resize', function () {
    const { width, height } = mainWindow.getContentBounds()
    const views = BrowserView.getAllViews()
    views.forEach(view => {
      view.setBounds({
        x: 0,
        y: 40,
        width,
        height: height - 40
      })
    })
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

app.whenReady().then(() => {
  createWindow()
  
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

ipcMain.on('init-view', () => {
  BrowserView.getAllViews().forEach(item => {
    mainWindow.removeBrowserView(item);
  })
  const browserview = createBrowserView({ url: 'http://localhost:3010' })
  const nav = navigator.push({ name: 'Welcome', view: browserview.view });
  mainWindow.webContents.send('navigatorPush', {
    name: nav.name,
    id: nav.id
  })
})

ipcMain.on('open-file', openFile)

ipcMain.on('close-view', (event, { id }) => {
  const views = navigator.getAllViews();
  const view = views.find(item => item.id === id);
  if (view) {
    mainWindow.removeBrowserView(view.view);
    navigator.remove(id);
  }
})

ipcMain.on('switch-view', (event, { id }) => {
  const views = navigator.getAllViews();
  const view = views.find(item => item.id === id);
  if (view) {
    mainWindow.setBrowserView(view.view);
  }
})
