const { ipcRenderer } = require('electron');
const Navigator = require('./Navigator');

function initNavigator () {
  const navigator = new Navigator();
  
  const push = (e, options) => {
    navigator.push(options);
  };
  
  const remove = (e, id) => {
    navigator.remove(id);
  }
  
  ipcRenderer.on('navigatorPush', push);
  ipcRenderer.on('navigatorRemove', remove);
}

module.exports = initNavigator;
