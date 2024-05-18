import { storeToRefs } from 'pinia';
import { useSetStore } from '@r/store/setting';
import pinia from '@r/store';

import api_tx_local from './tx/api-local';
import api_kg_local from './kg/api-local';
import api_kw_local from './kw/api-local';
import api_mg_local from './mg/api-local';
import api_wy_local from './wy/api-local';

const setStore = useSetStore(pinia);
const { setList, apiSourceList } = storeToRefs(setStore);

let allApi = {
  local_tx: api_tx_local,
  local_kg: api_kg_local,
  local_kw: api_kw_local,
  local_mg: api_mg_local,
  local_wy: api_wy_local
};

try {
  const api_test_tx = await import('./tx/api-test');
  const api_test_kg = await import('./kg/api-test');
  const api_test_kw = await import('./kw/api-test');
  const api_test_mg = await import('./mg/api-test');
  const api_test_wy = await import('./wy/api-test');

  const testApi = {
    test_tx: api_test_tx.default,
    test_kg: api_test_kg.default,
    test_kw: api_test_kw.default,
    test_mg: api_test_mg.default,
    test_wy: api_test_wy.default
  };
  allApi = Object.assign(allApi, testApi);
  apiSourceList.value.push({ name: '测试音源', id: 'test' });
} catch (error) {
  console.log(error);
}

const getAPI = (source) => allApi[`${setList.value.apiSource}_${source}`];

const apis = (source) => {
  const api = getAPI(source);
  if (api) return api;
  throw new Error('Api is not found');
};

export { apis };
