import { session } from 'electron';

const mg = {
  url: new RegExp('migu'),
  headers: {
    'User-Agent':
      'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
    Referer: 'https://m.music.migu.cn/'
  }
};

const qq = {
  url: new RegExp('https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'),
  headers: {
    Origin: 'https://y.qq.com',
    Referer: (id) => `https://y.qq.com/n/yqq/playsquare/${id}.html`
  }
};

export const setSession = () => {
  const filter = {
    urls: [
      'https://m.music.migu.cn/*',
      'https://app.c.nf.migu.cn/*',
      'https://c.musicapp.migu.cn/*',
      'https://c.y.qq.com/*'
    ]
  };

  session.defaultSession.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
    if (mg.url.test(details.url)) {
      details.requestHeaders = { ...details.requestHeaders, ...mg.headers };
    }
    if (qq.url.test(details.url)) {
      console.log(details);
      details.requestHeaders.Origin = qq.headers.Origin;
      details.requestHeaders.Referer = qq.headers.Referer(details.requestHeaders.id);
    }

    callback({ requestHeaders: details.requestHeaders });
  });
};
