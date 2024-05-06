import axios from 'axios';

const { isCancel } = axios;
// 缓存发出的请求
const cacheRequest = {};

const service = axios.create();

const removeRepeatReq = (reqKey) => {
  if (cacheRequest[reqKey]) {
    cacheRequest[reqKey].abort();
    delete cacheRequest[reqKey];
  }
};

service.interceptors.request.use((config) => {
  const { url, method } = config;
  const reqKey = `${url}_${method}`;
  removeRepeatReq(reqKey);

  const abortController = new AbortController();
  config.signal = abortController.signal;
  cacheRequest[reqKey] = abortController;
  return config;
});

service.interceptors.response.use(
  (response) => {
    const { url, method } = response.config;
    const reqKey = `${url}_${method}`;
    removeRepeatReq(reqKey);

    return response;
  },
  (error) => {
    if (!isCancel(error)) {
      const { url, method } = error.config;
      const reqKey = `${url}_${method}`;
      removeRepeatReq(reqKey);
    }
  }
);

const http = async (url, method = 'GET', options) => {
  return new Promise((resolve, reject) => {
    service
      .request({ url, method, timeout: 5000, ...options })
      .then((res) => {
        console.log('请求获取', res);
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export default http;
