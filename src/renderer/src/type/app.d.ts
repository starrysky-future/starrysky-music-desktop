declare namespace SKY {
  interface MusicListItem {
    singer: string;
    name: string;
    albumName: string;
    albumId: string;
    source: string;
    interval: string;
    _interval: number;
    songmid: string;
    copyrightId?: string;
    img: string;
    lrc: null;
    lrcUrl?: string;
    mrcUrl?: string;
    trcUrl?: string;
    hash?: string;
    otherSource: null;
    types: array;
    _types: object;
    typeUrl: object;
  }
}
