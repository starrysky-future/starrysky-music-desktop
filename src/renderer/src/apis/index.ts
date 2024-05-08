import kg from './kg/index';
import kw from './kw/index';
import mg from './mg/index';
import tx from './tx/index';
import wy from './wy/index';

const sources = {
  sources: [
    {
      name: '网易音乐',
      id: 'wy',
      show: true
    },
    {
      name: '企鹅音乐',
      id: 'tx',
      show: true
    },
    {
      name: '酷狗音乐',
      id: 'kg',
      show: true
    },
    {
      name: '咪咕音乐',
      id: 'mg',
      show: true
    },
    {
      name: '酷我音乐',
      id: 'kw',
      show: true
    }
  ],
  kg,
  kw,
  mg,
  tx,
  wy
};

export default sources;
