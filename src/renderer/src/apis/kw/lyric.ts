import { axiosHttp } from '../request';
import { buildParams, decodeLyric, parseLrc, lrcTools } from './utils';

export const getLyric = async ({ songmid }, isGetLyricx = true) => {
  const res = await axiosHttp(
    `http://newlyric.kuwo.cn/newlyric.lrc?${buildParams(songmid, isGetLyricx)}`,
    'get',
    {}
  );

  const lrc = await decodeLyric(
    Buffer.from(Buffer.from(res, 'utf-8').toString('base64'), 'base64'),
    isGetLyricx
  );

  let lrcInfo;

  try {
    lrcInfo = parseLrc(lrc);
  } catch (err) {
    console.log(err);
  }

  if (lrcInfo.tlyric) lrcInfo.tlyric = lrcInfo.tlyric.replace(lrcTools.rxps.wordTimeAll, '');
  try {
    lrcInfo.lxlyric = lrcTools.parse(lrcInfo.lyric);
  } catch {
    lrcInfo.lxlyric = '';
  }
  lrcInfo.lyric = lrcInfo.lyric.replace(lrcTools.rxps.wordTimeAll, '');
  if (!lrcTools.existTimeExp.test(lrcInfo.lyric))
    return Promise.reject(new Error('Get lyric failed'));
  console.log(lrcInfo);
  return lrcInfo;
};
