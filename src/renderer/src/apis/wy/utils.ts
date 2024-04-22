import http from '../request';
import { eapi } from '../crypto';

export const eapiRequest = (url, data) => {
  return http('http://interface.music.163.com/eapi/batch', 'post', {
    headers: {
      myUA: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.90 Safari/537.36',
      myOrigin: 'https://music.163.com',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: eapi(url, data)
  });
};
