interface Sky {
  skyDataPath: string;
  rootDir: string;
}

declare global {
  let sky: Sky;
}
