declare namespace SKY {
  namespace Config {
    interface ScreenWH {
      width: number;
      height: number;
    }
    interface WindowSize extends ScreenWH {
      id: number;
      name: string;
    }
  }
}
