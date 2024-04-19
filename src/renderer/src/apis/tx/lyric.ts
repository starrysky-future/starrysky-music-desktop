// import { needleHttp } from '../request';

// export const getLyric = async ({ songId }, tryNum = 0) => {
//   if (tryNum > 2) throw new Error('歌词获取失败');
//   let res;

//   try {
//     res = await needleHttp('https://u.y.qq.com/cgi-bin/musicu.fcg', 'post', {
//       headers: {
//         myReferer: 'https://y.qq.com',
//         'user-agent':
//           'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
//       },
//       body: {
//         comm: {
//           ct: '19',
//           cv: '1859',
//           uin: '0'
//         },
//         req: {
//           method: 'GetPlayLyricInfo',
//           module: 'music.musichallSong.PlayLyricInfo',
//           param: {
//             format: 'json',
//             crypt: 1,
//             ct: 19,
//             cv: 1873,
//             interval: 0,
//             lrc_t: 0,
//             qrc: 1,
//             qrc_t: 0,
//             roma: 1,
//             roma_t: 0,
//             songID: songId,
//             trans: 1,
//             trans_t: 0,
//             type: -1
//           }
//         }
//       }
//     });
//   } catch (error) {
//     return getLyric({ songId }, tryNum + 1);
//   }
// };
