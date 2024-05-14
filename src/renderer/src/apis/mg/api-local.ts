import http from '../request';

const api_local = {
  async getMusicUrl({ copyrightId }, quality, tryNum = 0) {
    if (tryNum > 2) throw new Error('歌曲url请求失败');
    let resUrl;
    try {
      resUrl = await http(`http://localhost:9981/tx?copyrightId=${copyrightId}&quality=${quality}`);
    } catch (error) {
      return this.getMusicUrl({ copyrightId }, quality, tryNum + 1);
    }

    return resUrl.data;
  }
};

export default api_local;
