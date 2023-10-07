import { I18n } from '@ies/starling_intl';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useModel } from '@jupiter/plugin-runtime/model';
import { useHistory, useRouteMatch } from '@jupiter/plugin-runtime/router';
import { Layout, Menu, Modal, Button, Spin, Result, Message, ConfigProvider } from '@arco-design/web-react';
import { IconHome, IconCaretRight, IconCaretLeft } from '@arco-design/web-react/icon';
import enUS from '@arco-design/web-react/es/locale/en-US';
import { defineConfig, useRuntimeContext } from '@jupiter/plugin-runtime';
import adminEnLocal from '../i18n/locale/en-US.json';
import { AdminProvider } from '@/components/common';
import AppModel from '@/admin/models/appModel';
import userModel from '@/admin/models/userModel';
import { ReactComponent as Logo } from '@/assets/pico-logo-pc.svg';
import { picoApiAxios, request } from '@/api/picoApi';
import '@arco-design/theme-tech-pico/index.less';
import '@arco-design/theme-tech-pico/css/arco.css';
import '../style/index.global.less';
import { serviceIDMap, uiClsPrefix } from '@/utils/const';
import { InitTea, InitSlardar, InitGlobalEnv, getRegionPath, IsOversea, InitI18n, SlardarConfig, InitCSRF } from '@/utils';

const ArcoLangMap = {
  en: enUS,
};

const MenuItem = Menu.Item;
const { SubMenu } = Menu;
const { Sider } = Layout;
const { Header } = Layout;
const { Footer } = Layout;
const { Content } = Layout;

Modal.config({ prefixCls: uiClsPrefix });

const App = ({ Component, ...pageProps }: { Component: React.ComponentType }) => {
  const { context } = useRuntimeContext();
  const globalEnvInfo: GolbalEnvType = context.getInitData();
  const { region, isOversea, currentLang } = globalEnvInfo;

  const history = useHistory();
  const [{ isInited, error, isError, isAdmin, needLogin }, userActions] = useModel(userModel);
  const [{ pathConfig, currentPathConfig, currentPath }, { setCurrentPath, setGlobalEnv, setPathConfig }] = useModel(AppModel);
  const [collapse, setCollapse] = useState(false);

  const match = useRouteMatch();
  const handleCollapsed = (val: boolean) => {
    setCollapse(val);
  };

  useLayoutEffect(() => {
    setGlobalEnv(globalEnvInfo);
  }, []);

  // User information initialization
  useEffect(() => {
    picoApiAxios.interceptors.request.use(config => {
      config.params = {
        ...config.params,
        service_id: serviceIDMap[region],
        lang: currentLang,
      };
      return config;
    });
    picoApiAxios.interceptors.response.use(
      response => response,
      reqError => {
        if (reqError?.data?.err_no) {
          if (reqError?.config?.slient) {
            console.log('静默处理');
            // Configure silent processing
          } else {
            Message.error(reqError?.data?.err_msg || '请求异常');
          }

          return Promise.reject(reqError);
        }

        Message.error(reqError.message || '网络出错了');
        return Promise.reject(reqError);
      },
    );
    InitTea();
    InitSlardar({}, { isOversea, region });

    userActions.fetch();
    const adminPathConfig = [
      {
        title: I18n.t('post_management', {}, '帖子管理'),
        icon: <IconHome />,
        children: [
          {
            title: I18n.t('post_recommendation', {}, '帖子推荐'),
            path: '/post/recommend',
          },
          {
            title: I18n.t('post_recycling_pool', {}, '帖子回收池'),
            path: '/post/delete',
          },
          {
            title: I18n.t('post_self_seeing_pool', {}, '帖子自见池'),
            path: '/post/hide',
          },
          {
            title: I18n.t('post_report_pool', {}, '帖子举报池'),
            path: '/post/report',
          },
        ],
      },
      {
        title: I18n.t('section_management', {}, '版块管理'),
        icon: <IconHome />,
        children: [
          {
            title: I18n.t('category_management', {}, '版块分类管理'),
            path: '/category/type',
          },
          {
            title: I18n.t('section_management', {}, '版块管理'),
            path: '/category/management',
          },
          {
            title: I18n.t('section_recommendation', {}, '版块推荐'),
            path: '/category/recommend',
          },
        ],
      },
      {
        title: I18n.t('message_management', {}, '消息管理'),
        icon: <IconHome />,
        children: [
          {
            title: I18n.t('custom_message', {}, '自定义消息'),
            path: '/message/custom',
          },
        ],
      },
      {
        title: I18n.t('user_management', {}, '用户管理'),
        icon: <IconHome />,
        children: [
          {
            title: I18n.t('user_authorization/prohibition', {}, '用户授权/禁言'),
            path: '/user/management',
          },
          {
            title: I18n.t('user_group_management', {}, '用户组管理'),
            path: '/user/group',
          },
        ],
      },
      {
        title: I18n.t('points_management', {}, '积分管理'),
        icon: <IconHome />,
        children: [
          {
            title: I18n.t('points_increase/decrease', {}, '积分增加/减少'),
            path: '/point/management',
          },
        ],
      },
      {
        title: I18n.t('topic_management', {}, '话题管理'),
        icon: <IconHome />,
        children: [
          {
            title: I18n.t('topic_management', {}, '话题管理'),
            path: '/topic/management',
          },
          {
            title: I18n.t('topic_recommendation', {}, '话题推荐'),
            path: '/topic/recommend',
          },
        ],
      },
    ];
    if (!isOversea) {
      adminPathConfig[0].children.push({
        title: I18n.t('cqc_pending_confirmation_processing_pool', {}, 'CQC待确认处理池'),
        path: '/post/confirm',
      });
    }
    setPathConfig(adminPathConfig);
  }, []);

  // Pages are checked using templates
  useEffect(() => {
    setCurrentPath(match.path);
  }, [match.path]);

  let $content = (
    <Layout className="layout-collapse-base">
      <Sider
        collapsed={collapse}
        onCollapse={handleCollapsed}
        collapsible={true}
        trigger={collapse ? <IconCaretRight /> : <IconCaretLeft />}
        breakpoint="xl">
        <div className="logo">
          <Logo
            style={{ width: 70 }}
            onClick={() => {
              history.push('/');
            }}
          />
        </div>
        <Menu autoOpen={true} selectedKeys={[currentPath]} onClickMenuItem={key => history.push(key)} style={{ width: '100%' }}>
          {pathConfig.map(item => (
            <SubMenu
              key={item.title}
              title={
                <span>
                  {item.icon}
                  {item.title}
                </span>
              }>
              {item.children?.map(subItem => (
                <MenuItem key={subItem.path}>{subItem.title}</MenuItem>
              ))}
            </SubMenu>
          ))}
        </Menu>
      </Sider>
      <Layout>
        <Header className="pico-admin-header">{currentPathConfig.title}</Header>
        <Layout style={{ padding: '0 12px' }}>
          <Content>
            <Component {...pageProps} />
          </Content>
          <Footer />
        </Layout>
      </Layout>
    </Layout>
  );

  if (!isAdmin || isError || error) {
    $content = (
      <div className="pico-admin-wrap">
        <Result
          status="403"
          subTitle={
            needLogin
              ? I18n?.t('not_currently_logged_in__please_go_to_the_homepage_to_log_in_first!', {}, '当前未登录，请先去首页登录哦!')
              : I18n?.t('no_administrator_rights!', {}, '无管理员权限哦！')
          }
          extra={
            < a href= >
              <Button type="primary">{I18n?.t('go_to_the_home_page', {}, '去首页')}</Button>
            </ a>
          }
        />
      </div>
    );
  }

  if (!isInited) {
    $content = (
      <div className="pico-admin-wrap">
        <Spin size={50} />
      </div>
    );
  }

  return (
    <AdminProvider customRequest={request} lang={currentLang as any}>
      <ConfigProvider prefixCls={uiClsPrefix} locale={ArcoLangMap[currentLang as any]}>
        {$content}
      </ConfigProvider>
    </AdminProvider>
  );
};

const initI18n = async (isOversea, currentLang) => {
  await InitI18n(
    currentLang,
    isOversea
      ? {
          // 海外兜底文案使用英文
          en: {
            translation: adminEnLocal,
          },
        }
      : {},
    {
      apiKey: 'd5b8114038cb11edb2fe3990602d52f1', // 项目对应apiKey，在平台上查看，更多实例化参数见下方
      namespace: ['admin'],
    },
  );
};
// get global env info before render
App.init = async () => {
  try {
    InitCSRF();
    const { region, isOversea, errorMsg, currentLang } = await InitGlobalEnv();
    await initI18n(isOversea, isOversea ? 'en' : 'zh');
    return {
      region,
      isOversea,
      errorMsg,
      currentLang,
    };
  } catch (errorMsg) {
    await initI18n(IsOversea(), IsOversea() ? 'en' : 'zh');
    return {
      errorMsg,
    };
  }
};

defineConfig(App, {
  slardar: SlardarConfig as any,
});

export default App;