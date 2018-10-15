const electron = require('electron')
const {app, BrowserWindow, Menu, shell, Tray} = require('electron')
const path = require('path')
const url = require('url')
const format = require('date-fns/format')
const ja = require('date-fns/locale/ja')

let win
function createWindow () {
  const {width, height} = electron.screen.getPrimaryDisplay().workAreaSize
  win = new BrowserWindow({
    width,
    height,
    titleBarStyle: 'hidden',
  })
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
  }))

  win.on('closed', () => {
    win = null
  })
}

function createTray () {
  const tray = new Tray(path.join(__dirname, 'icon.png'))
  const updateDate = () => tray.setTitle(format(new Date(), 'MMMDo', { locale: ja }))
  updateDate()
  setInterval(updateDate, 900000)

  tray.on('click', () => {
    win.isVisible() && win.isFocused() ? win.hide() : win.show()
  })
}

app.dock.hide();
app.on('ready', () => {
  createWindow();
  createTray();
  createMenu();
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})

function createMenu() {
  var template = [
  {
        label: 'gCal Client',
        submenu: [
          { label: 'Quit', accelerator: 'CmdOrCtrl+Q', click: function() { app.quit(); } },
        ]
  },
  {
    label: 'Edit',
    submenu: [
      {
        label: 'Cut',
        accelerator: 'CmdOrCtrl+X',
        role: 'cut'
      },
      {
        label: 'Copy',
        accelerator: 'CmdOrCtrl+C',
        role: 'copy'
      },
      {
        label: 'Paste',
        accelerator: 'CmdOrCtrl+V',
        role: 'paste'
      },
    ]
  },
  {
    label: 'Window',
    role: 'window',
    submenu: [
      {
        label: 'Minimize',
        accelerator: 'CmdOrCtrl+M',
        role: 'minimize'
      },
      {
        label: 'Toggle Dev Tools',
        accelerator: 'F12',
        click: function() { win.toggleDevTools(); }
      },
      {
        label: 'Toggle Full Screen',
        accelerator: (function() {
          if (process.platform == 'darwin')
            return 'Ctrl+Command+F';
          else
            return 'F11';
        })(),
        click: function(item, focusedWindow) {
          if (focusedWindow)
            focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
        }
      },
    ]
  },
  {
    label: 'Author',
    role: 'author',
    submenu: [
      {
        label: 'shwld',
        click: function() { shell.openExternal('https://github.com/shwld') }
      },
      {
        label: 'blog',
        click: function() { shell.openExternal('https://www.shwld.net') }
      },
    ]
  },
  {
    label: 'Products',
    role: 'products',
    submenu: [
      {
        label: 'MdNote',
        click: function() { shell.openExternal('http://md-note.com') }
      },
      {
        label: 'Markdown Office',
        click: function() { shell.openExternal('https://mdoffice.shwld.net') }
      },
    ]
  }];
  if (process.platform == 'darwin') {
    template[1].submenu.unshift({
      label: 'Undo',
      accelerator: 'CmdOrCtrl+Z',
      role: 'undo'
    },
    {
      label: 'Redo',
      accelerator: 'Shift+CmdOrCtrl+Z',
      role: 'redo'
    },
    {
      type: 'separator'
    });
    template[1].submenu.push({
      label: 'Select All',
      accelerator: 'CmdOrCtrl+A',
      role: 'selectall'
    });
  }

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}
