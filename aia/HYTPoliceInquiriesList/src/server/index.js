// 引入 axios
import axios from 'axios';
import { getLocalStorage } from '../tool/utils';
/**
 * 模拟登录
 * @param {*} params
 * @returns
 */
export const getToken = (params = {}) => {
  const { identitySign, passWord } = params;
  return axios({
    url: '/commandcenter-uaa-service/auth/login/dev',
    method: 'post',
    data: {
      clientType: 1,
      identitySign: identitySign || 'YueSir',
      passWord: passWord || 'Command_123'
    },
  });
};

/**
 * 查询警单列表
 * @returns
 */
export const getPoliceAlertList = (data, page, url) => {
  const { current, pageSize } = page;
  return axios({
    url: `/${url}/${pageSize}/${current}`,
    method: 'post',
    data,
    headers: {
      Authorization: localStorage.getItem('Authorization')
    }
  });
};
