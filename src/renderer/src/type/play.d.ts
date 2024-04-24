declare namespace SKY {
  namespace Play {
    interface PlayListItem {
      id: string;
      name: string;
      list: Array<SKY.MusicListItem>;
    }
    interface PlayList {
      playId: number;
      playListId: string;
      defaultList: PlayListItem;
      loveList: PlayListItem;
    }
    interface CurPlayInfo extends SKY.MusicListItem {
      statu: string;
      isPlay: boolean;
    }

    interface ArrowInfo {
      arrowPosition?: string;
      arrowSize?: number;
    }
  }
}
