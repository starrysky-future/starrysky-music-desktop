import axios from 'axios';

// function newAbortSignal(timeout) {
//   const abortController = new AbortController();
//   setTimeout(() => abortController.abort(), timeout || 0);

//   return abortController.signal;
// }

const http = async (url, method = 'GET', options) => {
  return new Promise((resolve, reject) => {
    axios
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
