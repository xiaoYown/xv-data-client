const path = require('path');
const fs = require('fs');
const { BrowserView, ipcRenderer } = require('electron');

const loadXVD = require('./loaders/xvd-loader');

const openFile = file => {
  ipcRenderer.send('open-file', {
    url: `http://localhost:3000/passid/edit?file=${encodeURIComponent(file)}`
  });
}

const getAllViews = () => {
  console.log(BrowserView)
  return BrowserView.getAllViews()
}

window.XV = {
  name: 'xv-data-sdk',
  version: '0.0.1',
  path,
  fs,
  loadXVD,
  openFile,
  getAllViews,
}