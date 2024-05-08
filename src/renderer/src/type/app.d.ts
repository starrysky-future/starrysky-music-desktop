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
}
