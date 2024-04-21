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

    interface SongList {
      limit: number;
      list: Array<ListType>;
      pageSize: number;
      source: string;
      total: number;
    }

    // 歌单列表数据存储类型
    type SongListSource = {
      [key: string]: SongList;
    };

    interface Source {
      name: string;
      id: string;
    }

    type Sources = Array<Source>;

    type MusicListType = Array<SKY.MusicListItem>;

    type MusicListOrInfo = {
      list: MusicListType;
      info: {
        name: string;
        img: string;
        desc: string;
        play_count?: number;
        author?: string;
      };
    };

    type MusicList = {
      [key: string]: MusicListOrInfo;
    };

    interface MusicObj {
      list: MusicList;
      pageSize: number;
      limit: number;
      total: number;
      source: string;
    }

    // 歌曲列表数据存储类型
    type MusicObjSource = {
      [key: string]: MusicObj;
    };

    interface SearchMusicListItem {
      list: Array<MusicListType>;
      pageSize: number;
      limit: number;
      total: number;
      source: string;
    }

    type SearchMusicList = {
      [key: string]: SearchMusicListItem;
    };

    interface Position {
      x: number;
      y: number;
      width?: number;
      height?: number;
    }

    interface SortListItem {
      name: string;
      id: string;
    }
    type SortList = Array<SortListItem>;
  }
}
