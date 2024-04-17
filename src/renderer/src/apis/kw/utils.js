import { inflate } from 'zlib';
import iconv from 'iconv-lite';
import { decodeName } from '../utils';

const buf_key = Buffer.from('yeelion');
const buf_key_len = buf_key.length;

const handleInflate = async (data) => {
  return new Promise((resolve, reject) => {
    inflate(data, (err, result) => {
      console.log(err);
      console.log(result);

      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
};

export const buildParams = (id, isGetLyricx) => {
  let params = `user=12345,web,web,web&requester=localhost&req=1&rid=MUSIC_${id}`;
  if (isGetLyricx) params += '&lrcx=1';
  const buf_str = Buffer.from(params);
  const buf_str_len = buf_str.length;
  const output = new Uint16Array(buf_str_len);
  let i = 0;
  while (i < buf_str_len) {
    let j = 0;
    while (j < buf_key_len && i < buf_str_len) {
      output[i] = buf_key[j] ^ buf_str[i];
      i++;
      j++;
    }
  }
  return Buffer.from(output).toString('base64');
};

export const decodeLyric = async (buf, isGetLyricx) => {
  console.log(buf);
  if (buf.toString('utf8', 0, 10) != 'tp=content') return '';
  console.log(111);
  console.log(buf.slice(buf.indexOf('\r\n\r\n') + 4));

  const lrcData = await handleInflate(buf.slice(buf.indexOf('\r\n\r\n') + 4));
  console.log(222);

  if (!isGetLyricx) return iconv.decode(lrcData, 'gb18030');

  const buf_str = Buffer.from(lrcData.toString(), 'base64');
  const buf_str_len = buf_str.length;
  const output = new Uint16Array(buf_str_len);
  let i = 0;
  while (i < buf_str_len) {
    let j = 0;
    while (j < buf_key_len && i < buf_str_len) {
      output[i] = buf_str[i] ^ buf_key[j];
      i++;
      j++;
    }
  }

  console.log(output);

  return iconv.decode(Buffer.from(output), 'gb18030');
};

const timeExp = /^\[([\d:.]*)\]{1}/g;

export const parseLrc = (lrc) => {
  const lines = lrc.split(/\r\n|\r|\n/);
  const tags = [];
  const lrcArr = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const result = timeExp.exec(line);
    if (result) {
      const text = line.replace(timeExp, '').trim();
      let time = RegExp.$1;
      if (/\.\d\d$/.test(time)) time += '0';
      lrcArr.push({
        time,
        text
      });
    } else if (lrcTools.rxps.tagLine.test(line)) {
      tags.push(line);
    }
  }
  const lrcInfo = this.sortLrcArr(lrcArr);
  return {
    lyric: decodeName(this.transformLrc(tags, lrcInfo.lrc)),
    tlyric: lrcInfo.lrcT.length ? decodeName(this.transformLrc(tags, lrcInfo.lrcT)) : ''
  };
};

export const lrcTools = {
  rxps: {
    wordLine: /^(\[\d{1,2}:.*\d{1,4}\])\s*(\S+(?:\s+\S+)*)?\s*/,
    tagLine: /\[(ver|ti|ar|al|offset|by|kuwo):\s*(\S+(?:\s+\S+)*)\s*\]/,
    wordTimeAll: /<(-?\d+),(-?\d+)(?:,-?\d+)?>/g,
    wordTime: /<(-?\d+),(-?\d+)(?:,-?\d+)?>/
  },
  parse(lrc) {
    const lines = lrc.split(/\r\n|\r|\n/);
    const tools = Object.create(this);
    tools.isOK = true;
    tools.offset = 1;
    tools.offset2 = 1;
    tools.lines = [];
    tools.tags = [];

    for (const line of lines) {
      if (!tools.isOK) throw new Error('failed');
      tools.parseLine(line);
    }
    if (!tools.lines.length) return '';
    let lrcs = tools.lines.join('\n');
    if (tools.tags.length) lrcs = `${tools.tags.join('\n')}\n${lrcs}`;
    return lrcs;
  },
  existTimeExp: /\[\d{1,2}:.*\d{1,4}\]/
};
