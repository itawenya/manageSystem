const { app, ipcMain } = require('electron');
const { windows, createMainWindow, createLoginWindow, createPWDWindow, createDialog } = require('./windowManager');
const Store = require('electron-store');

Store.initRenderer()

// 监听 app 的各种事件...
// app相当于整个应用程序，拥有不同的生命周期 Electron会在初始化后并准备创建浏览器窗口时，调用这个函数。 部分 API 在 ready 事件触发后才能使用。

app.on('ready', createLoginWindow);
app.on('window-all-closed', () => {
    // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，否则绝大部分应用及其菜单栏会保持激活。
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
app.on('activate', () => {
    // 在macOS上，当单击dock图标并且没有其他窗口打开时，
    // 通常在应用程序中重新创建一个窗口。
    if (loginWindow === null) {
        createLoginWindow()
    }
})


// 主进程窗口操作
ipcMain.on('window-min', () => {
    windows.mainWindow.minimize()
})

ipcMain.on('window-close', () => {
    if (windows.dialog !== null) {
        windows.dialog.close()
    }
    windows.mainWindow.close();
})


// 登录窗口操作
ipcMain.on('login-close', () => {
    windows.loginWindow.close();
})
ipcMain.on('login-deny', () => {
    if (windows.mainWindow !== null) {
        windows.mainWindow.close()
        windows.mainWindow = null
    }
    createLoginWindow()
})
ipcMain.on('login-access', () => {
    if (windows.loginWindow !== null) {
        windows.loginWindow.close()
        windows.loginWindow = null
    }
    createMainWindow()
})


// 找回密码窗口操作
ipcMain.on('findPWD-open', () => {
    windows.loginWindow.close()
    windows.loginWindow = null
    createPWDWindow()
})

ipcMain.on('findPWD-min', () => {
    windows.PWDWindow.minimize()
})

ipcMain.on('findPWD-close', () => {
    windows.PWDWindow.close()
    windows.PWDWindow = null
    createLoginWindow()
})


// 日志弹窗操作
ipcMain.on('openDialog', () => {
    if (windows.dialog !== null) {
        windows.dialog.focus() // 存在 则聚焦
        return
    }
    createDialog()
})

ipcMain.on('log-window-min', () => {
    if (windows.dialog !== null) {
        windows.dialog.minimize()
    }
})

ipcMain.on('log-window-close', () => {
    if (windows.dialog !== null) {
        windows.dialog.close()
        windows.dialog = null
    }
})