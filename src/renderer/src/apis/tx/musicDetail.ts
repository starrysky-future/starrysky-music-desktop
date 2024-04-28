export const getPic = async (songInfo) => {
  return Promise.resolve(
    `https://y.qq.com/music/photo_new/T002R500x500M000${songInfo.albumId}.jpg`
  );
};
