const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const fs = require("original-fs");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      nodeIntegrationInSubFrames: true,
      enableRemoteModule: true,
      contextIsolation: false //required flag
    }
  });
  //win.setMenu(null);
  win.maximize();

  win.loadFile("index.html");
};

app.whenReady().then(() => {
  createWindow();

  // On macOS, the app should not quit even when all windows are closed
  app.on("activate", () => {
    if (BroswerWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// close app when all windows are closed on Windows and Linux
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.on("save-file", (event, arg) => {
  const options = {
    title: "Save File",
    defaultPath: "./",
    buttonLabel: "Save",
    filters: [
      {
        name: "JSON",
        extensions: ["json"]
      }
    ]
  };

  dialog.showSaveDialog({
    title: "Save File",
    defaultPath: "./",
    buttonLabel: "Save",
    filters: [
      {
        name: "JSON",
        extensions: ["json"]
      }
    ]
  }).then(file => {
    if (file) {
      fs.writeFile(file.filePath.toString(), JSON.stringify(arg), err => {
        if (err) {
          console.log(err);
        }
      });
    }
  });
});

ipcMain.on("load-file", (event, arg) => {
  const options = {
    title: "Load File",
    defaultPath: "./",
    buttonLabel: "Load",
    filters: [
      {
        name: "JSON",
        extensions: ["json"]
      }
    ]
  };

  dialog.showOpenDialog({
    title: "Load File",
    defaultPath: "./",
    buttonLabel: "Load",
    filters: [
      {
        name: "JSON",
        extensions: ["json"]
      }
    ]
  }).then(file => {
    if (file) {
      fs.readFile(file.filePaths[0], (err, data) => {
        if (err) {
          console.log(err);
        } else {
          event.sender.send("load-file", JSON.parse(data));
        }
      });
    }
  });
});
