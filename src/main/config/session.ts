import { session } from 'electron';

const defaultHeaders = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36'
};

export const setSession = () => {
  const filter = {
    urls: ['https://*/*', 'http://*/*']
  };
  session.defaultSession.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
    const setHeader = {};

    if (details.requestHeaders.myUA) {
      setHeader['User-Agent'] = details.requestHeaders.myUA;
      delete details.requestHeaders.myUA;
    }
    if (details.requestHeaders.myReferer) {
      setHeader['Referer'] = details.requestHeaders.myReferer;
      delete details.requestHeaders.myReferer;
    }
    if (details.requestHeaders.myOrigin) {
      setHeader['Origin'] = details.requestHeaders.myOrigin;
      delete details.requestHeaders.myOrigin;
    }
    if (details.requestHeaders.myCookie) {
      setHeader['cookie'] = details.requestHeaders.myCookie;
      delete details.requestHeaders.myCookie;
    }
    details.requestHeaders = {
      ...defaultHeaders,
      ...details.requestHeaders,
      ...setHeader
    };

    callback({ requestHeaders: details.requestHeaders });
  });
};
