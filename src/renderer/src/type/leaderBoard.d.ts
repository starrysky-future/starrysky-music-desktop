declare namespace SKY {
  namespace LeaderBoard {
    interface LayoutListItem {
      id: string;
      name: string;
      bangid: string;
    }
    type LayoutList = Array<LayoutListItem>;

    type LeaderBoardList = {
      [key: string]: Array<SKY.MusicListItem>;
    };

    interface LeaderBoardObj {
      list: LeaderBoardList;
      pageSize: number;
      limit: number;
      total: number;
      source: string;
    }
  }
}
