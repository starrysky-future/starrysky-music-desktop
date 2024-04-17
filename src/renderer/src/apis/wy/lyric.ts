import { needleHttp } from '../request';
import { eapi } from '../crypto';

export const getLyric = async ({ songmid }) => {
  const res = await needleHttp('https://interface3.music.163.com/eapi/song/lyric/v1', 'post', {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.90 Safari/537.36',
      origin: 'https://music.163.com'
    },
    form: eapi('/api/song/lyric/v1', {
      id: songmid,
      cp: false,
      tv: 0,
      lv: 0,
      rv: 0,
      kv: 0,
      yv: 0,
      ytv: 0,
      yrv: 0
    })
  });

  const fixTimeLabelLrc = fixTimeLabel(res.lrc.lyric, res.tlyric?.lyric, res.romalrc?.lyric);
  const info = parseTools.parse(
    res.yrc?.lyric,
    res.ytlrc?.lyric,
    res.yromalrc?.lyric,
    fixTimeLabelLrc.lrc,
    fixTimeLabelLrc.tlrc,
    fixTimeLabelLrc.romalrc
  );
  console.log('歌词信息', info);

  return info;
};

const fixTimeLabel = (lrc, tlrc, romalrc) => {
  if (lrc) {
    const newLrc = lrc.replace(/\[(\d{2}:\d{2}):(\d{2})]/g, '[$1.$2]');
    const newTlrc = tlrc?.replace(/\[(\d{2}:\d{2}):(\d{2})]/g, '[$1.$2]') ?? tlrc;
    if (newLrc != lrc || newTlrc != tlrc) {
      lrc = newLrc;
      tlrc = newTlrc;
      if (romalrc)
        romalrc = romalrc
          .replace(/\[(\d{2}:\d{2}):(\d{2,3})]/g, '[$1.$2]')
          .replace(/\[(\d{2}:\d{2}\.\d{2})0]/g, '[$1]');
    }
  }

  return { lrc, tlrc, romalrc };
};

const parseTools = {
  rxps: {
    info: /^{"/,
    lineTime: /^\[(\d+),\d+\]/,
    wordTime: /\(\d+,\d+,\d+\)/,
    wordTimeAll: /(\(\d+,\d+,\d+\))/g
  },
  msFormat(timeMs: number) {
    const ms = timeMs % 1000;
    timeMs /= 1000;
    const m = Math.floor(timeMs / 60)
      .toString()
      .padStart(2, '0');
    timeMs %= 60;
    const s = Math.floor(timeMs).toString().padStart(2, '0');
    return `[${m}:${s}.${ms}]`;
  },
  parseLyric(lines) {
    const pagelrcLines: Array<unknown> = [];
    const lrcLines: Array<unknown> = [];

    for (let line of lines) {
      line = line.trim();
      const result = this.rxps.lineTime.exec(line);
      if (!result) {
        if (line.startsWith('[offset')) {
          pagelrcLines.push(line);
          lrcLines.push(line);
        }
        continue;
      }

      const startMsTime = parseInt(result[1]);
      const startTimeStr = this.msFormat(startMsTime);
      if (!startTimeStr) continue;

      const words = line.replace(this.rxps.lineTime, '');

      lrcLines.push(`${startTimeStr}${words.replace(this.rxps.wordTimeAll, '')}`);

      let times = words.match(this.rxps.wordTimeAll);
      if (!times) continue;
      times = times.map((time) => {
        const result = /\((\d+),(\d+),\d+\)/.exec(time);
        return `<${Math.max(parseInt(result![1]) - startMsTime, 0)},${result![2]}>`;
      });
      const wordArr = words.split(this.rxps.wordTime);
      wordArr.shift();
      const newWords = times.map((time, index) => `${time}${wordArr[index]}`).join('');
      pagelrcLines.push(`${startTimeStr}${newWords}`);
    }
    return {
      lyric: lrcLines.join('\n'),
      pagelyric: pagelrcLines.join('\n')
    };
  },
  parseHeaderInfo(str) {
    str = str.trim();
    str = str.replace(/\r/g, '');
    if (!str) return null;
    const lines = str.split('\n');
    return lines.map((line) => {
      if (!this.rxps.info.test(line)) return line;
      try {
        const info = JSON.parse(line);
        const timeTag = this.msFormat(info.t);
        return timeTag ? `${timeTag}${info.c.map((t) => t.tx).join('')}` : '';
      } catch {
        return '';
      }
    });
  },
  getIntv(interval) {
    if (!interval.includes('.')) interval += '.0';
    const arr = interval.split(/:|\./);
    while (arr.length < 3) arr.unshift('0');
    const [m, s, ms] = arr;
    return parseInt(m) * 3600000 + parseInt(s) * 1000 + parseInt(ms);
  },
  fixTimeTag(lrc, targetlrc) {
    let lrcLines = lrc.split('\n');
    const targetlrcLines = targetlrc.split('\n');
    const timeRxp = /^\[([\d:.]+)\]/;
    let temp: Array<unknown> = [];
    const newLrc: Array<unknown> = [];
    targetlrcLines.forEach((line) => {
      const result = timeRxp.exec(line);
      if (!result) return;
      const words = line.replace(timeRxp, '');
      if (!words.trim()) return;
      const t1 = this.getIntv(result[1]);

      while (lrcLines.length) {
        const lrcLine = lrcLines.shift();
        const lrcLineResult = timeRxp.exec(lrcLine);
        if (!lrcLineResult) continue;
        const t2 = this.getIntv(lrcLineResult[1]);
        if (Math.abs(t1 - t2) < 100) {
          const lrc = line.replace(timeRxp, lrcLineResult[0]).trim();
          if (!lrc) continue;
          newLrc.push(lrc);
          break;
        }
        temp.push(lrcLine);
      }
      lrcLines = [...temp, ...lrcLines];
      temp = [];
    });
    return newLrc.join('\n');
  },
  parse(ylrc, ytlrc, yrlrc, lrc, tlrc, rlrc) {
    const info = {
      lyric: '',
      tlyric: '',
      rlyric: '',
      pagelyric: ''
    };
    if (ylrc) {
      const lines = this.parseHeaderInfo(ylrc);
      if (lines) {
        const result = this.parseLyric(lines);
        if (ytlrc) {
          const lines = this.parseHeaderInfo(ytlrc);
          if (lines) {
            // if (lines.length == result.lyricLines.length) {
            info.tlyric = this.fixTimeTag(result.lyric, lines.join('\n'));
            // } else info.tlyric = lines.join('\n')
          }
        }
        if (yrlrc) {
          const lines = this.parseHeaderInfo(yrlrc);
          if (lines) {
            // if (lines.length == result.lyricLines.length) {
            info.rlyric = this.fixTimeTag(result.lyric, lines.join('\n'));
            // } else info.rlyric = lines.join('\n')
          }
        }

        const timeRxp = /^\[[\d:.]+\]/;
        const headers = lines.filter((l) => timeRxp.test(l)).join('\n');
        info.lyric = `${headers}\n${result.lyric}`;
        info.pagelyric = result.pagelyric;
        return info;
      }
    }
    if (lrc) {
      const lines = this.parseHeaderInfo(lrc);
      if (lines) info.lyric = lines.join('\n');
    }
    if (tlrc) {
      const lines = this.parseHeaderInfo(tlrc);
      if (lines) info.tlyric = lines.join('\n');
    }
    if (rlrc) {
      const lines = this.parseHeaderInfo(rlrc);
      if (lines) info.rlyric = lines.join('\n');
    }

    return info;
  }
};
