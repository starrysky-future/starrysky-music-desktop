declare namespace SKY {
  namespace Play {
    interface PlayListItme {
      id: string;
      name: string;
      list: Array<MusicListItem>;
    }
    interface MusicListItem {
      singer: string;
      name: string;
      albumName: string;
      albumId: string;
      source: string;
      interval: string;
      _interval: number;
      songmid: string;
      img: string;
      lrc: null;
      hash?: string;
      otherSource: null;
      types: array;
      _types: object;
      typeUrl: object;
    }

    interface PlayList {
      playId: number;
      playListId: string;
      defaultList: PlayListItme;
      loveList: PlayListItme;
    }
    interface CurPlayInfo extends MusicListItem {
      curLyric: string;
      isPlay: boolean;
    }

    interface ArrowInfo {
      arrowPosition?: string;
      arrowSize?: number;
    }
  }
}
