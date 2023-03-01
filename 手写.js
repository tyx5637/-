// 二分查找
function search(arr, target) {
  let length = arr.length;
  let left = 0,
    right = length - 1;
  while (left <= right) {
    let mid = Math.floor(length / 2);
    if (arr[mid] < target) {
      left = mid + 1;
    } else if (arr[mid] > target) {
      right = mid - 1;
    } else {
      return mid;
    }
  }
  return -1;
}
// 冒泡排序
// 比较所有相邻的元素，如果第一个比第二个大，就交换，一轮比较下来能保证最后的值是最大的
function bubble(arr) {
  let len = arr.length;
  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        let temp = arr[j + 1];
        arr[j + 1] = arr[j];
        arr[j] = temp;
      }
    }
  }
  return arr;
}
// 快速排序
// 寻找一个基准，大的放右边，小的放左边
function quick(arr) {
  let len = arr.length;
  let left = [],
    right = [];
  let pivotIndex = Math.floor(len / 2);
  let pivot = arr.splice(pivotIndex, 1)[0];
  for (let i = 0; i < len; i++) {
    if (arr[i] > pivot) {
      right.push(arr[i])
    } else {
      left.push(arr[i])
    }
  };
  return quick(left).concat([pivot], quick(right))
}
// 插入排序
// 从第二个数往前比，比他大就往后排，以此类推，进行到最后一个数
function insert(arr) {
  for (let i = 0; i < arr.length; i++) {
    const temp = arr[i];
    let j = i;
    while (j > 0) {
      if (arr[j - 1] > temp) {
        arr[j] = arr[j - 1];
      } else {
        break;
      }
      j -= 1;
    }
    arr[j] = temp;
  }
  return arr;
}
// 选择排序
// 找到数组中的最小值，选中并肩齐放在第一位，然后找第二小的值
// 放在第二位；以此类推，执行n-1轮
function choose(arr) {
  for (let i = 0; i < arr.length; i++) {
    let indexMin = i;
    // 找到最小的元素
    for (let j = i; j < arr.length; j++) {
      if (arr[j] < arr[indexMin]) {
        indexMin = j;
      }
    }
    // 如果和当前元素不一样则交换
    if (indexMin !== i) {
      let temp = arr[i];
      arr[i] = arr[indexMin];
      arr[indexMin] = temp;
    }
    return arr;
  }
}
// 归并排序
// 将长度为n的输入序列分成两个长度为n/2的子序列，对这两个子序列分别采用
// 归并排序；将两个排序好的子序列合并成一个最终的排序序列
function merge(left, right) {
  let temp = [];
  while (left.length && right.length) {
    if (left[0] < right[0]) {
      temp.push(left.shift())
    } else {
      temp.push(right.shift())
    }
  }
  return temp.concat(left, right)
}
function mergeSort(arr) {
  const len = arr.length;
  if (len < 2) return arr;
  let mid = Math.floor(len / 2);
  let left = arr.slice(0, mid);
  let right = arr.slice(mid);
  return merge(mergeSort(left), mergeSort(right));
}
// 先序遍历
function preOrder(arr) {
  let res = [];
  const rec = n => {
    if (!n) return;
    res.push(n.val);
    rec(n.left);
    rec(n.rigt);
  }
  rec(root);
  return res;
}
// 层序遍历
function levelOrder(root) {
  let res = [],
    quene = [];
  quene.push(root);
  if (root === null) return res;
  while (quene.length !== 0) {
    let len = quene.length;
    let curLevel = [];
    for (let i = 0; i < len; i++) {
      let node = quene.shift();
      node.left && quene.push(node.left);
      node.right && quene.push(node.right);
    }
    res.push(curLevel);
  }
  return res;
}
// 数组转树
function convert(list, id = 0) {
  let res = [];
  for (let i = 0; i < list.length; i++) {
    // 如果当前项的父id和自己的id相同则push
    if (list[i].parentId === id) {
      res.push(list[i]);
      // 将当前元素的id作为父id进行转换
      list[i].children = convert(list, list[i].id)
    }
  }
  return res;
}
// 树转数组
function fn(obj, res = []) {
  res.push(obj);
  if (obj.children && obj.children.length) {
    for (const item of obj.children) {
      fn(item, res);
    }
  }
  return res;
}
// promise
class myPromise {
  static PENDING = 'pending';
  static FULFILLED = 'fulfilled';
  static REJECTED = 'rejected';
  constructor(func) {
    this.PromiseState = myPromise.PENDING;
    this.PromiseResult = null;
    // ?
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];
    try {
      // ？
      func(this.resolve.bind(this), this.reject.bind(this));
    } catch (error) {
      this.reject(error);
    }
  }
  resolve(result) {
    if (this.PromiseState === myPromise.PENDING) {
      this.PromiseState = myPromise.FULFILLED;
      this.PromiseResult = result;
      this.onFulfilledCallbacks.forEach(callback => {
        callback(result);
      })
    }
  }
  reject(result) {
    if (this.PromiseState === myPromise.PENDING) {
      this.PromiseState = myPromise.REJECTED;
      this.PromiseResult = result;
      this.onRejectedCallbacks.forEach(callback => {
        callback(result);
      })
    }
  }
  then(onFulfilled, onRejected) {
    const myPromise2 = new myPromise((resolve, reject) => {
      if (this.PromiseState === myPromise.FULFILLED) {
        setTimeout(() => {
          try {
            if (typeof onFulfilled !== 'function') {
              resolve(this.PromiseResult);
            } else {
              let x = onFulfilled(this.PromiseResult);;
              resolvePromise(promise2, x, resolve, reject);
            }
          } catch (e) {
            reject(e)
          }
        })
      } else if (this.PromiseState === myPromise.REJECTED) {
        setTimeout(() => {
          try {
            if (typeof onRejected !== 'function') {
              reject(this.PromiseResult);
            } else {
              let x = onRejected(this.PromiseResult);
              resolvePromise(promise2, x, resolve, reject)
            }
          } catch (e) {
            reject(e)
          }
        })
      } else if (this.PromiseState === myPromise.PENDING) {
        this.onFulfilledCallbacks.push(() => {
          setTimeout(() => {
            try {
              if (typeof onRejected !== 'function') {
                resolve(this.PromiseResult);
              } else {
                let x = onFulfilled(this.PromiseResult);
                resolvePromise(promise2, x, resolve, reject);
              }
            } catch (e) {
              reject(e)
            }
          })
        })
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              if (typeof onRejected !== 'function') {
                reject(this.PromiseResult);
              } else {
                let x = onRejected(this.PromiseResult);
                resolvePromise(promise2, x, resolve, reject)
              }
            } catch (e) {
              reject(e)
            }
          });
        });
      }
    })
    return promise2
  }
  catch(onRejected) {
    return this.then(undefined, onRejected);
  }
  finally(callback) {
    return this.then(callback, callback);
  }
  static resolve(value) {
    if (value instanceof myPromise) {
      return value;
    } else if (value instanceof Object && 'then' in value) {
      return new myPromise((resolve, reject) => {
        value.then(resolve, reject)
      })
    }
    return new myPromise(resolve => {
      resolve(value)
    })
  }
  static reject(reason) {
    return new myPromise((resolve, reject) => {
      reject(reason)
    })
  }
  static all(iterators) {
    return new myPromise((resolve, reject) => {
      let promises = Array.from(iterators);
      let result = [];
      let count = 0;
      if (promises.length === 0) {
        return resolve(promises);
      }
      promises.forEach((item, index) => {
        myPromise.resolve(item).then(
          value => {
            count++;
            result[index] = value;
            count === promises.length && resolve(result);
          },
          reason => {
            reject(reason)
          }
        )
      })
    })
  }
  static allSettled(iterators) {
    return new myPromise((resolve, reject) => {
      let promises = Array.from(iterators);
      let result = [];
      let count = 0;
      if (promises.length === 0) return resolve(promises);
      promises.forEach((item, index) => {
        myPromise.resolve(item).then(
          value => {
            count++;
            result[index] = {
              status: 'fulfilled',
              value
            }
            count === promises.length && resolve(result);
          },
          reason => {
            count++;
            result[index] = {
              status: 'rejected',
              reason
            }
            count === promises.length && resolve(result)
          }
        )
      })
    })
  }
  static any(iterators) {
    return new myPromise((resolve, reject) => {
      let promises = Array.from(iterators)
      let errors = [];
      let count = 0;
      if (promises.length === 0) return reject(new AggregateError('All promises were rejected'))
      promises.forEach(item => {
        myPromise.resolve(item).then(
          value => {
            resolve(value);
          },
          reason => {
            count++;
            errors.push(reason);
            count === promises.length && reject(new AggregateError(errors))
          }
        )
      })
    })
  }
  static race(iterators) {
    return new myPromise((resolve, reject) => {
      let promises = Array.from(iterators);
      if (promises.length > 0) {
        promises.forEach(item => {
          myPromise.resolve(item).then(resolve, reject);
        })
      }
    })
  }
}
/**
 * 对resolve()、reject() 进行改造增强 针对resolve()和reject()中不同值情况进行处理
 * @param  {promise} promise2 promise1.then方法返回的新的promise对象
 * @param  {[type]} x         promise1中onFulfilled或onRejected的返回值
 * @param  {[type]} resolve   promise2的resolve方法
 * @param  {[type]} reject    promise2的reject方法
 */
// resolvePromise为Promise 解决过程：[[Resolve]](promise2, x)
function resolvePromise(promise2, x, resolve, reject) {
  // 如果从 onFulfilled 或 onRejected 中返回的 x 就是 promise2，会导致 循环引用报错，这部分的处理就是要解决这个问题
  if (x === promise2) {
    throw new TypeError('Chaining cycle detected for promise')
  }
  if (x instanceof myPromise) {
    // 如果 x 为 Promise ，则使 promise2 接受 x 的状态也就是继续执行x，如果执行的时候拿到一个y，还要继续解析y
    x.then(y => {
      resolvePromise(promise2, y, resolve, reject)
    }, reject)
  } else if (x != null && ((typeof x === 'object' || (typeof x === 'function')))) {
    // 如果x为对象或函数
    try {
      var then = x.then;
    } catch (e) {
      // 如果取 x.then 的值时抛出错误 e ，则以 e 为据因拒绝 promise
      return reject(e);
    }
    if (typeof then === 'function') {
      let called = false;
      try {
        then.call(
          x,
          y => {
            if (called) return;
            called = true;
            resolvePromise(promise2, y, resolve, reject);
          },
          r => {
            if (called) return;
            called = true;
            reject(r);
          })
      } catch (e) {
        if (called) return;
        called = true;
        reject(e);
      }
    } else {
      return resolve(x)
    }
  }
}
// 浅拷贝
function clone(origin, target = {}) {
  for (let prop in origin) {
    target[prop] = origin[prop];
  }
  return target;
}
// 深拷贝
function deepClone(target, cache = new Map()) {
  if (cache.get(target)) {
    return cache.get(target)
  }
  if (target instanceof Object) {
    let dist;
    if (target instanceof Array) {
      dist = [];
    } else if (target instanceof Function) {
      dist = function () {
        return target.call(this, ...arguments);
      }
    } else if (target instanceof RegExp) {
      dist = new RegExp(target.source, target.flags);
    } else if (target instanceof Date) {
      dist = new Date(target);
    } else {
      dist = {};
    }
    cache.set(target, dist);
    for (let key in target) {
      if (target.hasOwnProperty(key)) {
        dist[key] = deepClone(target[key], cache);
      }
    }
    return dist;
  } else {
    return target;
  }
}
// 防抖
function debounce(fn, delay) {
  let timeout = null;
  return function () {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn.apply(this, arguments);
    }, delay)
  }
}
// 节流
function throttle(fn) {
  let canrun = true;
  return function () {
    if (!canrun) return;
    canrun = false;
    setTimeout(() => {
      fn.apply(this, arguments);
      canrun = true;
    }, delay)
  }
}
// requestAnimationFrame 节流
function throttle(fn) {
  let lock = true;
  return function (...args) {
    if (!lock) return;
    lock = false;
    window.requestAnimationFrame(() => {
      func.apply(this, args);
      lock = true;
    })
  }
}
// new
function myNew(con, ...args) {
  // 创建一个新对象
  let obj = {};
  // 新对象的[[prototype]]被赋值为构造函数的prototype属性
  obj.__proto__ = con.prototype;
  // 构造函数内部的this被赋值为这个新对象，即this指向新对象
  let result = con.apply(obj, args);
  return result instanceof object ? result : obj;
}
// 柯里化
function curry(fn) {
  if (typeof fn !== 'function') {
    throw TypeError('fn is not a function');
  }
  return function nest(...args) {
    if (args.length === fn.length) {
      return fn(...args);
    } else {
      return function (args) {
        return nest(...args, arg)
      }
    }
  }
}
// instanceof
function myInstanceof(target, origin) {
  while (target) {
    if (target.__proto__ === origin.prototype) {
      return true;
    }
    target = target.__proto__;
  }
  return false;
}
// 数组去重
/** 遍历 */
Array.prototype.unique = function () {
  let temp = {},
    arr = [],
    len = this.length;
  for (let i = 0; i < len; i++) {
    if (!temp[this[i]]) {
      temp[this[i]] = 'abc';
      arr.push(this[i]);
    }
  }
  return arr;
}
/** indexof */
function unique(arr) {
  if (!Array.isArray(arr)) {
    return;
  }
  let res = [];
  let len = arr.length;
  for (let i = 0; i < len; i++) {
    let cur = arr[i];
    if (res.indexOf(cur) === -1) {
      res.push(cur);
    }
  }
  return res;
}
/** sort */
function unique(arr) {
  arr = arr.sort((a, b) => a - b);
  let res = [arr[0]];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] !== arr[i - 1]) {
      res.push(arr[i])
    }
  }
  return res;
}
/** splice */
function unique(arr) {
  let len = arr.length;
  for (let i = 0; i < len; i++) {
    for (let j = i + 1; j < len; j++) {
      if (arr[i] == arr[j]) {
        arr.splice(j, 1);
        j--;
      }
    }
    return arr;
  }
}
/** set */
function unique(arr) {
  return Array.from(new Set(arr));
}
/** filter */
function unique(arr) {
  return arr.filter(function (item, index, arr) {
    return arr.indexOf(item, 0) === index;
  })
}
/** map */
function unique(arr) {
  const seen = new Map();
  return arr.filter((a) => !seen.has(a) && seen.set(a, 1));
}
// 组合函数
function compose(...fns) {
  return function (x) {
    return fns.reduceRight((pre, cur) => {
      return cur(pre)
    }, x)
  }
}
// 管道函数
function pipe(...fns) {
  return function (x) {
    return fns.reduce((pre, cur) => {
      return cur(pre)
    })
  }
}
// 订阅者模式的实现
class Observer {
  constructor() {
    this.message = {};
  }
  $on(type, callback) {
    if (!this.message[type]) {
      this.message[type] = [];
    }
    this.message[type].push(callback);
  }
  $off(type, callback) {
    if (!this.message[type]) return;
    if (!callback) {
      this.message[type] = undefined;
    }
    this.message[type] = this.message[type].filter(item => item !== callback)
  }
  $emit(type) {
    if (!this.message[type]) return;
    this.message[type].forEach(item => {
      item();
    })
  }
}
/** 数组拍平 */
//使用reduce
let flat = (arr) => {
  return arr.reduce((pre, cur) => {
    return pre.concat(Array.isArray(cur) ? flat(cur) : cur);
  }, [])
}
//递归
let flat = arr => {
  let res = [];
  for (let i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i])) {
      flat(arr[i]);
    } else {
      res.push(arr[i]);
    }
  }
}
// flat(depth): Array.prototype.flat() - JavaScript | MDN
function flat(array, depth = 1) {
  return depth > 0 ? array.reduce((pre, item) => {
    return pre.concat(Array.isArray(item) ? flat(item, depth - 1) : item)
  }, []) : array.slice()
}
// toString()方法，toString方法会去掉中括号
function flat(arr) {
  if (!Array.isArray(arr)) {
    return false;
  }
  let res = arr.toString().split(',').map(item => {
    return item
  })
  return res;
}
// generator实现flat函数
function* flat(arr, num) {
  if (num === undefined) num = 1;
  for (const item of arr) {
    if (Array.isArray(item) && num > 0) {
      yield* flat(item, num - 1);
    } else {
      yield item
    }
  }
}