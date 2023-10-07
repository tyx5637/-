import React, { forwardRef, PropsWithChildren, useContext, useEffect, useImperativeHandle, useMemo } from 'react';

import CustomEventNode from './CustomEventNode';

interface DataEventProviderProps {
  evtData: any;
  /** block 状态, 为 true 时暂存当前事件,待 block 状态解除再发送 */
  block?: boolean;
}

const rootEventNode = new CustomEventNode();

/** 社区中台组件全局配置Context */
export const DataEventContext = React.createContext<CustomEventNode>(rootEventNode);

/** 社区中台事件中心节点 */
const DataEventProvider = forwardRef<CustomEventNode, PropsWithChildren<DataEventProviderProps>>(({ evtData, block, children }, ref) => {
  const evtObj = useMemo(() => new CustomEventNode(), []);
  const parentEvtObj = useContext(DataEventContext);

  useEffect(() => {
    evtObj.setParent(parentEvtObj);
  }, [parentEvtObj, evtObj]);

  useEffect(() => {
    evtObj.block = Boolean(block);
  }, [block, evtObj]);

  useEffect(() => {
    evtObj.evtData = evtData;
  }, [evtData, evtObj]);

  useImperativeHandle(ref, () => evtObj, [evtObj]);

  return <DataEventContext.Provider value={evtObj}>{children}</DataEventContext.Provider>;
});

export default DataEventProvider;
