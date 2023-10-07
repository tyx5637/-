import React, { useEffect } from 'react';
import { I18n } from '@ies/starling_intl';

import { CommunityConfigProviderProps, CommunityContextType } from './interface';
import UserActionInterface from './UserActionInterface';

import { request } from '@/api/picoApi';
import { setUploadApiContext } from '@/api/upload';

const defaultCommunityContext: CommunityContextType = {
  customRequest: request,
  userAction: new UserActionInterface(),
  prefixCls: 'community',
  lang: 'zh',
  locale: undefined,
  env: 'production',
  service_id: null,
  regionPath: '',
  isOversea: false,
  globalInfo: {
    defaultErrorImg: '',
    defaultUserAvatar: '',
    officialAvatar: '',
    officialNickname: () => I18n.t('official', {}, '官方'),
    isOversea: false,
  },
};

function combineConfig(config: CommunityConfigProviderProps, defaultConfig: CommunityContextType): CommunityContextType {
  const result = { ...defaultConfig, ...config };
  result.globalInfo = { ...defaultConfig.globalInfo, ...config.globalInfo };
  return result;
}
/** 社区中台组件全局配置Context */
export const CommunityConfigContext = React.createContext<CommunityContextType>(defaultCommunityContext);

/** 社区中台组件全局配置Provider */
const ConfigProvider: React.FC<CommunityConfigProviderProps> = ({ children, ...others }) => {
  const contextValue = combineConfig(others, defaultCommunityContext);

  useEffect(() => {
    setUploadApiContext({
      appId: others.appId,
      userId: others.user?.uid || 'unlogin',
      customRequest: others.customRequest,
    });
  }, [others.user?.uid, others.appId, others.customRequest]);

  return <CommunityConfigContext.Provider value={contextValue}>{children}</CommunityConfigContext.Provider>;
};

export * from './interface';
export { default as UserActionInterface } from './UserActionInterface';
export default ConfigProvider;
