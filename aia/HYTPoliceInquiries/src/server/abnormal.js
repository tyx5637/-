/*
 * @Author: FanWeiHua
 * @Date: 2021-06-27 14:42:22
 * @LastEditTime: 2022-03-15 16:31:30
 * @Description: http异常处理
 */
'use strict';
/**
 * 错误处理
 * @param error
 */
export const dealError = (error, response) => {
  const state = {
    code: error.response.status,
    desc: '',
    response: response.data,
  };
  switch (error.response.status) {
    case 400:
      console.log('错误请求');
      state.desc = '错误请求';
      break;
    case 401:
      console.log('登录过期');
      state.desc = '登录过期';
      break;
    case 403:
      console.log('拒绝访问');
      state.desc = '拒绝访问';
      break;
    case 404:
      console.log('请求错误，未找到该资源');
      state.desc = '请求错误，未找到该资源';
      break;
    case 405:
      console.log('请求方法未允许');
      state.desc = '请求方法未允许';
      break;
    case 408:
      console.log('请求超时');
      state.desc = '请求超时';
      break;
    case 500:
      console.log('服务器端出错');
      state.desc = '服务器端出错';
      break;
    case 501:
      console.log('网络未实现');
      state.desc = '网络未实现';
      break;
    case 502:
      console.log('网络错误');
      state.desc = '网络错误';
      break;
    case 503:
      console.log('服务不可用');
      state.desc = '服务不可用';
      break;
    case 504:
      console.log('网络超时');
      state.desc = '网络超时';
      break;
    case 505:
      console.log('http版本不支持该请求');
      state.desc = 'http版本不支持该请求';
      break;
    default:
      console.log(`连接错误${error.response.status}`);
      state.desc = `连接错误${error.response.status}`;
  }
  return state;
};
/**
 * 返回网络状态
 */
export const statusCode = (code) => {
  const state = {
    timeout: {
      desc: '请求超时',
      code: 4001,
    },
    Network: {
      desc: '网络异常',
      code: 4002,
    },
  };
  return state[code];
};
