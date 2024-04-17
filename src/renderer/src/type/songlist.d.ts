declare namespace SKY {
  namespace SongList {
    interface ListItemType {
      play_count: string;
      id: string;
      author: string;
      name: string;
      time: string;
      img: string;
      grade: string;
      total: number;
      desc: string;
      source: string;
    }

    type ListType = Array<ListItemType>;

    type SongListSource = {
      [key: string]: SongList;
    };

    interface SongList {
      limit: number;
      list: Array<ListType>;
      pageSize: number;
      source: string;
      total: number;
    }

    interface Source {
      name: string;
      id: string;
    }

    type Sources = Array<Source>;

    // 歌曲
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

    type MusicList = {
      [key: string]: {
        list: Array<MusicListItem>;
        info: {
          name: string;
          img: string;
          desc: string;
          play_count?: number;
          author?: string;
        };
      };
    };

    type MusicObjSource = {
      [key: string]: MusicObj;
    };

    interface MusicObj {
      list: MusicList;
      page: number;
      limit: number;
      total: number;
      source: string;
    }

    interface Position {
      x: number;
      y: number;
      width?: number;
      height?: number;
    }
  }
}
