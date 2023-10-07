import { cloneDeep } from 'lodash';

const EventListenSymbol = Symbol('EventListen');
const EventCatchSymbol = Symbol('EventCatch');
const InnerProp = Symbol('InnerProp');

/** 事件数据 */
interface EventData {
  /** 事件名称 */
  name: string;
  data: any;
  /** 事件上下文 */
  context: any[];
}

/** 事件监听记录 */
interface EventListenRecord {
  handle: (data: EventData) => void;
  once: boolean;
}

let i = 1;

/** 缓存事件 */
interface EventCatchItem {
  evtName: string;
  evtData: any;
}
class CustomEventNode {
  /** 事件监听池 */
  [EventListenSymbol]: { [key: string]: Set<EventListenRecord> };

  /** 缓存事件池 */
  [EventCatchSymbol]: Set<EventCatchItem>;

  /** 内部状态 */
  [InnerProp]: {
    id: number;
    /** block 状态, block 状态下 trigger 的事件会被暂存, 带状态解除再发出 */
    isBlock: boolean;
    parent: null | CustomEventNode;
    eventData: any;
  };

  constructor() {
    this[InnerProp] = Object.create(null);
    this[EventListenSymbol] = Object.create(null);
    this[EventCatchSymbol] = new Set();

    this[InnerProp].id = i++;
    this[InnerProp].isBlock = false;
    this[InnerProp].parent = null;
    this[InnerProp].eventData = {};

    if (process.env.NODE_ENV === 'development') {
      window.CommunityEventNodes = window.CommunityEventNodes || [];
      window.CommunityEventNodes.push(this);
    }
  }

  get id() {
    return this[InnerProp].id;
  }

  get evtData() {
    return this[InnerProp].eventData;
  }

  set evtData(val) {
    this[InnerProp].eventData = val;
  }

  get block() {
    return this[InnerProp].isBlock;
  }

  set block(status: boolean) {
    const oldStatus = this[InnerProp].isBlock;
    this[InnerProp].isBlock = status;

    // 解禁
    if (!status && oldStatus) {
      // 把缓存事件都发出并情况事件缓存池(注意死循环), 同步代码应该没问题
      this[EventCatchSymbol].forEach(eventItem => {
        this.trigger(eventItem.evtName, eventItem.evtData);
      });
      this[EventCatchSymbol].clear();
    }
  }

  setParent(parent: CustomEventNode) {
    this[InnerProp].parent = parent;
  }

  getContext(): any[] {
    const ctx = this[InnerProp].parent?.getContext() || [];
    ctx.unshift(this[InnerProp].eventData);
    return ctx;
  }

  /** 添加事件监听, 仅监听一次 */
  once(evtName: string, fuc: (evt: EventData) => void): () => void {
    this[EventListenSymbol][evtName] = this[EventListenSymbol][evtName] || new Set();
    this[EventListenSymbol][evtName].add({
      handle: fuc,
      once: true,
    });

    return () => {
      this.off(evtName, fuc);
    };
  }

  /** 添加事件监听 */
  on(evtName: string, fuc: (evt: EventData) => void, once = false): () => void {
    this[EventListenSymbol][evtName] = this[EventListenSymbol][evtName] || new Set();
    this[EventListenSymbol][evtName].add({
      handle: fuc,
      once,
    });

    return () => {
      this.off(evtName, fuc);
    };
  }

  /** 取消事件监听 */
  off(evtName: string, fuc: any) {
    if (!this[EventListenSymbol][evtName]) {
      return;
    }
    this[EventListenSymbol][evtName].forEach(item => {
      if (item.handle === fuc) {
        this[EventListenSymbol][evtName].delete(item);
      }
    });
  }

  /** 抛出事件 */
  trigger(evtName: string, val: any, context?: any[]) {
    if (!evtName) {
      return;
    }

    if (this[InnerProp].isBlock) {
      this[EventCatchSymbol].add({ evtName, evtData: cloneDeep(val) });
      return;
    }

    // 带上自己的上下文, 构造新 context
    const newContext = Array.from(context || []);
    newContext.push(this[InnerProp].eventData);

    // 执行监听函数
    const actions = this[EventListenSymbol][evtName];
    if (actions) {
      actions.forEach(action => {
        const { handle, once } = action;
        try {
          handle.call(this, {
            name: evtName,
            data: val,
            context: newContext,
          });
        } catch (e) {
          console.error(e);
        }
        if (once) {
          actions.delete(action);
        }
      });
    }

    this[InnerProp].parent?.trigger?.(evtName, val, newContext);
  }
}

export default CustomEventNode;
