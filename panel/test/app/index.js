var app = require('electron').app;
var PanelWindow = require('../../').PanelWindow;
var path = require('path')

var mainWindow = null;

app.on('ready', function () {
  mainWindow = new PanelWindow({
    center: true,
    width: 100,
    height: 100,
    minHeight: 100,
    minWidth: 100,
    show: false,
    transparent: true,
  });
  mainWindow.loadURL('file://' + __dirname + '/index.html')
  mainWindow.on('closed', function () { mainWindow = null })
  mainWindow.on('ready-to-show',function() {
    mainWindow.show();
  });
})