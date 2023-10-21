/*
 * @Author: master
 * @Date: 2021-12-02 13:28:23
 * @LastEditTime: 2022-03-15 16:31:43
 * @Description: 文件服务
 */
import XLSX from 'xlsx';
/**
 * 通用的文件下载
 * @param url 下载地址，也可以是一个blob对象，必传
 * @param fileName 保存文件名，可选
 */
export const downloadFile = (url, fileName) => {
  try {
    if (typeof url === 'object' && url instanceof Blob) {
      url = URL.createObjectURL(url); // 创建blob地址
    }
    const aLink = document.createElement('a');
    aLink.href = url;
    aLink.download = fileName || ''; // 指定保存文件名，可以不需要后缀
    let event;
    if (window.MouseEvent) event = new MouseEvent('click');
    else {
      event = document.createEvent('MouseEvents');
      event.initMouseEvent(
        'click',
        true,
        false,
        window,
        0,
        0,
        0,
        0,
        0,
        false,
        false,
        false,
        false,
        0,
        null,
      );
    }
    aLink.dispatchEvent(event);
  } catch (e) {
    console.error(e);
  }
};
/**
 * 下载base64图片
 * @param content 图片名称
 * @param fileName base64地址
 */
export const downloadBase64File = (content, fileName = '文件') => {
  try {
    const base64ToBlob = (code) => {
      const parts = code.split(';base64,');
      const contentType = parts[0].split(':')[1];
      const raw = window.atob(parts[1]);
      const rawLength = raw.length;
      const uInt8Array = new Uint8Array(rawLength);
      for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
      }
      return new Blob([uInt8Array], { type: contentType });
    };
    const aLink = document.createElement('a');
    const blob = base64ToBlob(content); // new Blob([content]);
    const evt = document.createEvent('HTMLEvents');
    evt.initEvent('click', true, true); // initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
    aLink.download = fileName;
    aLink.href = URL.createObjectURL(blob);
    aLink.dispatchEvent(
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window,
      }),
    ); // 兼容火狐
  } catch (e) {
    console.error(e);
  }
};
/**
 * 将一个sheet转成最终的excel文件的blob对象，然后利用URL.createObjectURL下载
 * @param {*} sheet
 * @param {*} sheetName
 */
export const sheetToBlob = (sheet, sheetName) => {
  sheetName = sheetName || 'sheet1';
  const workbook = {
    SheetNames: [sheetName],
    Sheets: {},
  };
  workbook.Sheets[sheetName] = sheet;
  // 生成excel的配置项
  const wopts = {
    bookType: 'xlsx', // 要生成的文件类型
    bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
    type: 'binary',
  };
  // 字符串转ArrayBuffer
  const s2ab = (s) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
    return buf;
  };
  // eslint-disable-next-line no-undef
  const wbout = XLSX.write(workbook, wopts);
  return new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
};
/**
 * 将 html 字符串转换 word 文档流
 * @param {*} htmlStr
 * @param {*} wordName
 */
export const htmlToWordBlob = (htmlStr, wordName = 'word1') => {
  // 字符串转ArrayBuffer
  const s2ab = (s) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
    return buf;
  };
  return new Blob([s2ab(htmlStr)], {
    type: 'application/msword;charset=utf-8',
  });
};
