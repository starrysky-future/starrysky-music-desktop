import needle from 'needle';
import pinia from '@r/store';
import { storeToRefs } from 'pinia';
import { useSetStore } from '@r/store/setting';
import axios from 'axios';

const setStore = useSetStore(pinia);
const { loadingErr } = storeToRefs(setStore);

export const needleHttp = async (
  url,
  method = 'get',
  { timeout = 5000, headers, body, form, formData }
) => {
  const options = {
    headers: headers,
    json: true,
    response_timeout: 5000,
    timeout
  };
  let data;
  if (body) {
    data = body;
  } else if (form) {
    data = form;
    options.json = false;
  } else if (formData) {
    data = formData;
    options.json = false;
  }

  options.response_timeout = timeout;

  return new Promise((resolve, reject) => {
    loadingErr.value = false;
    needle.request(method, url, data, options, (err, res, body) => {
      if (err) {
        reject(err);
      }

      if (body && body?.code && body.code !== 200) {
        loadingErr.value = true;
        reject(body.msg);
      }
      resolve(JSON.parse(body));
    });
  });
};

function newAbortSignal(timeout) {
  const abortController = new AbortController();
  setTimeout(() => abortController.abort(), timeout || 0);

  return abortController.signal;
}

export const axiosHttp = async (
  url,
  method = 'GET',
  { timeout = 5000, headers, body, form, formData }
) => {
  const options = {
    headers: headers,
    json: true,
    response_timeout: 5000,
    timeout
  };
  const signal = newAbortSignal(timeout);

  let data;
  if (body) {
    data = body;
  } else if (form) {
    data = form;
    options.json = false;
  } else if (formData) {
    data = formData;
    options.json = false;
  }

  return new Promise((resolve, reject) => {
    axios
      .request({ url, method, signal, data, ...options })
      .then((res) => {
        console.log('请求获取', res);
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
