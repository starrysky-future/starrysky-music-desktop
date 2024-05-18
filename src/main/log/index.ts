import log from 'electron-log';

const mainLog = log.create({ logId: 'updaterLog' });
mainLog.transports.file.fileName = 'main.log';
// updaterLog.transports.file.level = false; // 不输出到日志文件
// updaterLog.transports.console.level = false; // 不输出到控制台
// 达到上限会备份一个updater.old.log文件，备份文件有且只有一个
mainLog.transports.file.maxSize = 1048576;

const updaterLog = log.create({ logId: 'updaterLog' });
updaterLog.transports.file.fileName = 'updater.log';
updaterLog.transports.file.maxSize = 1048576;

export { mainLog, updaterLog };
