declare namespace SKY {
  namespace Apis {
    interface Types {
      type: string;
      size: string;
    }
    interface _types {
      flac24bit: object;
      flac: object;
    }

    interface Types_kg extends Types {
      hash: string;
    }
  }
}
