import { ReactNode } from 'react';
import type { ConfigProviderProps as ArcoConfigProviderProps } from '@arco-design/web-react';

import type UserActionInterface from './UserActionInterface';

export type CustomRequestParams = {
  url: string;
  method: 'GET' | 'DELETE' | 'POST' | 'PUT' | 'PATCH';
  data?: any;
  params?: any;
  headers?: { [key: string]: string };
};
interface Locale {
  [key: string]: string;
}
export type CustomRequest = <R>(params: CustomRequestParams, options?: any) => Promise<R>;

// /** 修改部分属性为可选 */
// type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/** 修改部分属性为必填 */
type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

/** 社区中台组件全局配置属性 */
export interface CommunityConfigProviderProps {
  /** 自定义请求方法 */
  customRequest: CustomRequest;
  appId: number;
  service_id?: number | null; // 海外服务id
  /** 当前登录用户信息 [目前暂未使用] */
  user?: {
    uid?: string;
  };
  /** 用户交互协议实现 */
  userAction?: UserActionInterface;
  /** 语言包 [目前暂未使用] */
  locale?: Locale;
  /** 当前语言模式 */
  lang?: 'zh' | 'en' | 'zh-Hans-CN';
  regionPath?: string | '/jp' | '/kr';
  /** 运行模式 [目前暂未使用] */
  env?: 'development' | 'production';
  /** 社区中台通用类名前缀，默认community */
  prefixCls?: string;
  isOversea?: boolean;
  /** 通用信息 */
  globalInfo?: {
    isOversea?: boolean;
    /** 图片加载失败兜底 */
    defaultErrorImg?: string;
    /** 用户默认头像 */
    defaultUserAvatar?: string;
    /** 官方头像 */
    officialAvatar?: string;
    /** 官方昵称 */
    officialNickname?: () => string;
  };
  arcoConfigProviderProps?: ArcoConfigProviderProps;
  /** 话题前缀 */
  topicPrefix?: ReactNode;
}

/** 社区中台组件全局配置 Context 类型 */
export type CommunityContextType = RequiredBy<
  Omit<CommunityConfigProviderProps, 'user' | 'appId'>,
  'userAction' | 'lang' | 'env' | 'prefixCls' | 'globalInfo'
>;
