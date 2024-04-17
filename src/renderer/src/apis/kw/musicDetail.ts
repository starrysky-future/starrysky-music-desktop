import { axiosHttp } from '../request';

export const getPic = async ({ songmid }) => {
  const res = await axiosHttp(
    `http://artistpicserver.kuwo.cn/pic.web?corp=kuwo&type=rid_pic&pictype=500&size=500&rid=${songmid}`,
    'get',
    {}
  );

  return /^http/.test(res) ? res : null;
};
