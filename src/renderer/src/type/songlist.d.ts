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

    type MusicList = {
      [key: string]: {
        list: Array<SKY.MusicListItem>;
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
      pageSize: number;
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

    interface SortListItem {
      name: string;
      id: string;
    }
    type SortList = Array<SortListItem>;
  }
}
