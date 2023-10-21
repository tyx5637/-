import { Base64 } from 'js-base64';

/**
 * 获取SessionStorage信息
 */
export const getSessionStorage = key => {
  const keyInfo = Base64.encodeURI(key);
  const itemInfo = sessionStorage.getItem(keyInfo);
  if (itemInfo) {
    const info = Base64.decode(itemInfo);
    return JSON.parse(info);
  } else {
    return '';
  }
};

/**
 * 存储SessionStorage信息
 */
export const setSessionStorage = (key, value) => {
  const keyInfo = Base64.encodeURI(key);
  const itemInfo = Base64.encodeURI(JSON.stringify(value));
  sessionStorage.setItem(keyInfo, itemInfo);
};

/**
 * 存储LocalStorage信息
 */
export const setLocalStorage = (key, value) => {
  const keyInfo = Base64.encodeURI(key);
  const itemInfo = Base64.encodeURI(JSON.stringify(value));
  localStorage.setItem(keyInfo, itemInfo);
};

/**
 * 获取LocalStorage信息
 */
export const getLocalStorage = key => {
  const keyInfo = Base64.encodeURI(key);
  const itemInfo = localStorage.getItem(keyInfo);
  if (itemInfo) {
    const info = Base64.decode(itemInfo);
    return JSON.parse(info);
  } else {
    return '';
  }
};
