import http from '../request';

export const getLyric = async ({ lrcUrl }, tryNum = 0) => {
  if (!lrcUrl || tryNum > 2) throw new Error('获取歌词失败');

  try {
    const res = await http(lrcUrl, 'get', {
      headers: {
        myReferer: 'https://app.c.nf.migu.cn/',
        myUA: 'Mozilla/5.0 (Linux; Android 5.1.1; Nexus 6 Build/LYZ28E) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Mobile Safari/537.36',
        channel: '0146921'
      }
    });

    return {
      lyric: res,
      tlyric: '',
      rlyric: '',
      lxlyric: ''
    };
  } catch (error) {
    return getLyric({ lrcUrl }, tryNum + 1);
  }
};
