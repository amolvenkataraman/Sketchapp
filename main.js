const { app, BrowserWindow } = require("electron");
const { createReadStream } = require("original-fs");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
  });

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
