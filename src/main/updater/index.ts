import { is, ipcHelper } from '@electron-toolkit/utils';
import { BrowserWindow } from 'electron';
import { autoUpdater, UpdateInfo } from 'electron-updater';
import { updaterLog } from '../log';

// 自动下载更新
autoUpdater.autoDownload = false;
// 退出时自动安装更新
autoUpdater.autoInstallOnAppQuit = false;
autoUpdater.logger = updaterLog;

if (is.dev) {
  // 开发环境开启更新检查
  autoUpdater.forceDevUpdateConfig = true;
}

export default (win: BrowserWindow): void => {
  ipcHelper.on('checkForUpdates', () => {
    // 检查是否有更新
    autoUpdater.checkForUpdates();
  });
  ipcHelper.on('downloadUpdate', () => {
    updaterLog.info('开始下载更新');
    // 下载更新
    autoUpdater.downloadUpdate();
  });

  // 有新版本
  autoUpdater.on('update-available', (_info: UpdateInfo) => {
    updaterLog.info('存在新版本:', _info.version);
    win.webContents.send('update', {
      updateStatus: 'update-available',
      version: _info.version,
      size: _info.files[0].size
    });
  });

  // 没有新版本
  autoUpdater.on('update-not-available', (_info: UpdateInfo) => {
    updaterLog.info('当前版本为最新版本:', _info.version);
    win.webContents.send('update', {
      updateStatus: 'update-not-available',
      version: _info.version
    });
  });

  // 更新完毕
  autoUpdater.on('update-downloaded', () => {
    updaterLog.info('开始更新');
    // 退出并安装更新
    autoUpdater.quitAndInstall();
  });

  // 更新出错
  autoUpdater.on('error', (error) => {
    updaterLog.info('更新出错:', error);
    win.webContents.send('update', {
      updateStatus: 'error',
      error: error
    });
  });

  // 监听下载进度
  autoUpdater.on('download-progress', (progress) => {
    win.webContents.send('update', { updateStatus: 'download-progress', progress: progress });
  });
};
