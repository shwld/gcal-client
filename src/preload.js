function openExternal(url) {
  const {shell} = require('electron')
  shell.openExternal(url);
}

window.openExternal = openExternal
