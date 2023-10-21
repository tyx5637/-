/*
 * @Author: master
 * @Date: 2021-12-06 15:50:36
 * @LastEditTime: 2023-10-07 16:14:32
 * @Description: 水印
 */
import { getUuid } from './units.js';
import _ from 'lodash';
// 水印的样式
const constant = {
  container: document.body, // canvas渲染位置
  width: 500, // 每块img宽度
  height: 400, // 每块img高度
  font: 'normal 16px 思源黑体_ Regular', // 文字字体
  fillStyle: 'rgba(8, 90, 125, 0.1)', // 文字颜色
  content: '水印', // 文字内容，换行用\n
  rotate: 20, // 文字层翻转角度
  zIndex: 99999, // 元素层叠等级
  left: 0, // 元素居左距离
  top: 0, // 元素居上距离
  offsetLeft: 240, // 偏移居左
  offsetTop: 200, // 偏移居右
  fontOffsetLeft: 100, // 文字偏移居左
  fontOffsetTop: 150, // 文字偏移居右
};
// 创建水印base64图片
const createImgBase = (options) => {
  // 创建canvas element并设置他的宽高
  const canvas = document.createElement('canvas');
  canvas.setAttribute('width', options.width);
  canvas.setAttribute('height', options.height);
  // 创建二维渲染上下文
  const ctx = canvas.getContext('2d');
  // 设置字体样式
  ctx.font = options.font;
  // 描述颜色和样式
  ctx.fillStyle = options.fillStyle;
  // ctx.textAlign = 'center';
  ctx.rotate((Math.PI / -180) * options.rotate);
  // 分割水印内容
  const arrayContent = options.content ? options.content.split('\n') : '水印';
  options.x = options.x | 0;
  options.y = options.y | 0;
  arrayContent.forEach((item, index) => {
    const cIdex = index === 0 ? 1 : index + 1;
    ctx.fillText(item, 0, cIdex * 30 + options.y + options.fontOffsetTop);
  });
  // 返回一个包含图片展示的 data URI 
  const base64Url = canvas.toDataURL();
  return base64Url;
};
/**
 * canvas 实现 watermark
 * @param {Object} param
 */
const CanvasWM = (option = {}) => {
  // 将水印的样式以及对水印的设置传入进行合并
  let options = {
    ...constant,
    ...option,
  };
  // 定时器
  let intervalOut;
  const uuid = option.uuid || getUuid();
  const [watermarkDiv, watermarkDivDis] = [
    document.createElement('div'),
    document.createElement('div'),
  ];
  try {
    // 返回水印base64图片
    const base64Url = createImgBase({ ...options });
    const base64UrlDis = createImgBase({ ...options });
    const styleStr = `
      position:absolute;
      top:${options.top}px;
      left:${options.left}px;
      bottom:0;
      right:0;
      z-index:${options.zIndex};
      pointer-events:none;
      background-image:url('${base64Url}')`;
    const styleStrDis = `
      position:absolute;
      top:${options.offsetTop}px;
      left:${options.offsetLeft}px;
      bottom:0;
      right:0;
      z-index:${options.zIndex};
      pointer-events:none;
      background-image:url('${base64UrlDis}')`;
    const [divUuid, divDisUuid] = [uuid, `${uuid}-dis`];
    watermarkDiv.setAttribute('style', styleStr);
    watermarkDivDis.setAttribute('style', styleStrDis);
    watermarkDiv.setAttribute('id', divUuid);
    watermarkDivDis.setAttribute('id', divDisUuid);
    /**
     * 渲染水印
     */
    const renderWM = () => {
      if (options.container) {
        options.container.style.position = 'relative';
        options.container.appendChild(watermarkDiv);
        options.container.appendChild(watermarkDivDis);
      }
    };
    // 渲染水印
    renderWM();
    // 清除水印
    const remove = () => {
      const watermark = document.getElementById(divUuid);
      const watermarkDis = document.getElementById(`${uuid}-dis`);
      if (watermark) options.container.removeChild(watermark);
      if (watermarkDis) options.container.removeChild(watermarkDis);
    };
    // 此方法是防止用户通过 开发者工具 修改样式/或直接删除 祛除水印
    const observer = new MutationObserver(() => {
      const watermark = document.getElementById(divUuid);
      const watermarkDis = document.getElementById(`${uuid}-dis`);
      // MutationObserver监听元素变化，当出现变化时，重新渲染水印，保证用户操作水印
      if (!watermark || !watermarkDis) {
        // 清除水印
        remove();
        // 渲染水印
        renderWM();
      }
    });
    observer.observe(document.body, {
      childList: true, // 观察目标子节点的变化，是否有添加或者删除
      attributes: true, // 观察属性变动
      subtree: true, // 观察后代节点，默认为 false
    });
    // 开启定时任务
    if (
      options?.loopDuration &&
      _.isNumber(options.loopDuration) &&
      options?.loopCallBack &&
      _.isFunction(options.loopCallBack)
    ) {
      // 最少10秒钟
      if (options.loopDuration <= 10000) {
        options.loopDuration = 10000;
      }
      // 设置Interval定时器
      intervalOut = setInterval(() => {
        // 重新获取渲染参数
        const option = options.loopCallBack();
        if (_.isPlainObject(option)) {
          // 重新设置渲染参数
          options = { ...options, ...option };
          // 清除水印
          remove();
          // 渲染水印
          renderWM();
        } else {
          clearInterval(intervalOut);
        }
      }, options.loopDuration);
    }
    return {
      uuid,
      remove,
    };
  } catch (e) {
    console.error(e);
    if (intervalOut) clearInterval(intervalOut);
  }
};
// 调用
export default CanvasWM;

// units.js
export const getUuid = () => {
  const S4 = () => {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return (
    S4() +
    S4() +
    '-' +
    S4() +
    '-' +
    S4() +
    '-' +
    S4() +
    '-' +
    S4() +
    S4() +
    S4()
  );
};