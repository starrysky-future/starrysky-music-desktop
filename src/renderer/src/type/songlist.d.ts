declare namespace SKY {
  namespace SongList {
    interface CommonList {
      limit: number;
      pageSize: number;
      total: number;
      source: string;
    }
    interface ListItemType {
      play_count: number;
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

    interface SongList extends CommonList {
      list: Array<ListType>;
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

    interface MusicObj extends CommonList {
      list: MusicList;
    }

    // 歌曲列表数据存储类型
    type MusicObjSource = {
      [key: string]: MusicObj;
    };

    // 搜索歌曲数据类型
    interface SearchAllMusic extends CommonList {
      list: Array<SKY.MusicListItem>;
    }

    interface SearchMusicListItem extends CommonList {
      list: Array<MusicListType>;
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

    interface PopupListItem {
      id: string;
      name: string;
      show?: boolean;
    }
  }
}
