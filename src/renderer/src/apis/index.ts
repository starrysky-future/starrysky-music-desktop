import kg from './kg/index';
import kw from './kw/index';
import mg from './mg/index';
import tx from './tx/index';
import wy from './wy/index';

const sources = {
  sources: [
    {
      name: '网易音乐',
      id: 'wy'
    },
    {
      name: 'QQ音乐',
      id: 'tx'
    },
    {
      name: '酷狗音乐',
      id: 'kg'
    },
    {
      name: '咪咕音乐',
      id: 'mg'
    },
    {
      name: '酷我音乐',
      id: 'kw'
    }
  ],
  kg,
  kw,
  mg,
  tx,
  wy
};

export default sources;
