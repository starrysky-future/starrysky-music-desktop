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
    if (details.requestHeaders.myua) {
      setHeader['User-Agent'] = details.requestHeaders.myua;
      delete details.requestHeaders.myua;
    }
    if (details.requestHeaders.myreferer) {
      setHeader['Referer'] = details.requestHeaders.myreferer;
      delete details.requestHeaders.myreferer;
    }
    if (details.requestHeaders.myorigin) {
      setHeader['Origin'] = details.requestHeaders.myorigin;
      delete details.requestHeaders.myorigin;
    }
    details.requestHeaders = {
      ...defaultHeaders,
      ...details.requestHeaders,
      ...setHeader
    };

    callback({ requestHeaders: details.requestHeaders });
  });
};
