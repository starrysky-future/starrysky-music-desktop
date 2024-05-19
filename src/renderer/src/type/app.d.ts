declare namespace SKY {
  interface MusicListItem {
    singer: string;
    name: string;
    albumName: string;
    albumId: string;
    albumMid?: string;
    strMediaMid?: string;
    source: string;
    interval: string;
    _interval: number;
    songmid: string;
    songId?: string;
    copyrightId?: string;
    img: string;
    lrc: null;
    lrcUrl?: string;
    mrcUrl?: string;
    trcUrl?: string;
    hash?: string;
    otherSource: unknown;
    types: array;
    _types: object;
    typeUrl: object;
  }

  interface WH {
    width: number;
    height: number;
  }

  interface AppInfo {
    curVersion: string;
    lastVersion: string;
    updateSize: string;
  }

  interface ModalInfo {
    modalName: string;
    modalTitle: string;
    isModal: boolean;
    addInfo?: MusicListItem;
  }
  interface UpdateInfo {
    updateStatus: string;
    version?: string;
    size?: unknown;
    error?: unknown;
    progress?: UpdateProgress;
  }

  interface UpdateProgress {
    percent: number;
    transferred: string;
    bytesPerSecond: string;
  }
}
