const { ipcRenderer } = require('electron');
const initNavigator = require('./renderers/navigator');

window.onload = () => {
  ipcRenderer.send('init-view');
  initNavigator();
}
