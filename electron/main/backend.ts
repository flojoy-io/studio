import * as childProcess from "child_process";
import { join, resolve } from "path";
import { runCmd } from "./cmd";
import type { CallBackArgs } from "../api/index";

const sendBackendLogToStudio =
  (title: string, description: string) =>
  (win: Electron.BrowserWindow, data: CallBackArgs) => {
    if (global.initializingBackend) {
      win.webContents.send(
        "backend",
        typeof data === "string"
          ? {
              open: true,
              title,
              description,
              output: data,
            }
          : { ...data, title, description },
      );
    }
  };

const successText = "Uvicorn running on";

export const runBackend = (
  workingDir: string,
  win: Electron.BrowserWindow,
): Promise<{
  success: boolean;
  script: childProcess.ChildProcess | undefined;
}> => {
  const backendCommand = getBackendCommand(workingDir);
  return new Promise((resolve) => {
    const title = "Initializing backend...";
    const description =
      "Initialization can take up to few minutes for first time, please be patient!";
    sendBackendLogToStudio(title, description)(win, {
      open: true,
      clear: true,
      output: "Running backend script...",
    });
    runCmd(
      backendCommand,
      successText,
      win,
      "backend",
      sendBackendLogToStudio(title, description),
    )
      .then(({ script }) => {
        sendBackendLogToStudio(title, description)(win, {
          open: false,
          output: "backend initialized successfully!",
        });
        resolve({ success: true, script });
      })
      .catch((err) => {
        if (err.code > 0) {
          sendBackendLogToStudio(title, description)(win, {
            open: true,
            output: "Error: Failed to initialize backend try re lunching app!",
          });
          resolve({ success: false, script: undefined });
        }
      });
  });
};

const getBackendCommand = (workingDir: string) => {
  if (process.platform === "win32") {
    return `pwsh -File ${join(workingDir, "../backend/backend.ps1")}`;
  }
  return `bash "${resolve(join(workingDir, "../backend/backend.sh"))}"`;
};
