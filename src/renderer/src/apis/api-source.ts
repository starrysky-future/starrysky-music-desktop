import { storeToRefs } from 'pinia';
import { useSetStore } from '@r/store/setting';
import pinia from '@r/store';

import api_test_tx from './tx/api-test';
import api_test_kg from './kg/api-test';
import api_test_kw from './kw/api-test';
import api_test_mg from './mg/api-test';
import api_test_wy from './wy/api-test';

import api_tx_local from './tx/api-local';
import api_kg_local from './kg/api-local';
import api_kw_local from './kw/api-local';
import api_mg_local from './mg/api-local';
import api_wy_local from './wy/api-local';

const setStore = useSetStore(pinia);
const { setList } = storeToRefs(setStore);

const allApi = {
  test_tx: api_test_tx,
  test_kg: api_test_kg,
  test_kw: api_test_kw,
  test_mg: api_test_mg,
  test_wy: api_test_wy,
  local_tx: api_tx_local,
  local_kg: api_kg_local,
  local_kw: api_kw_local,
  local_mg: api_mg_local,
  local_wy: api_wy_local
};

const getAPI = (source) => allApi[`${setList.value.apiSource}_${source}`];

const apis = (source) => {
  const api = getAPI(source);
  if (api) return api;
  throw new Error('Api is not found');
};

export { apis };
