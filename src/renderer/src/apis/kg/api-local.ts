import http from '../request';

const api_local = {
  async getMusicUrl({ hash, albumId }, quality, tryNum = 0) {
    if (tryNum > 2) throw new Error('歌曲url请求失败');
    let resUrl;
    try {
      resUrl = await http(
        `http://localhost:9981/kg?hash=${hash}&albumId=${albumId}&quality=${quality}`
      );
      if (!resUrl.data) throw new Error('歌曲url请求失败');
    } catch (error) {
      return this.getMusicUrl({ hash, albumId }, quality, tryNum + 1);
    }

    return resUrl.data;
  }
};

export default api_local;
