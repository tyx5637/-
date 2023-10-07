import React, { useEffect, useState } from 'react';
import { useModel } from '@jupiter/plugin-runtime/model';
import { useHistory } from '@jupiter/plugin-runtime/router';
import { Layout, Menu, Modal, Button, Spin, Result, Message, ConfigProvider } from '@arco-design/web-react';
import { IconHome, IconCaretRight, IconCaretLeft } from '@arco-design/web-react/icon';
import { useRouteMatch } from 'react-router-dom';
import { AdminProvider } from '@byted-tech/community';
import AppModel from '@/admin/models/appModel';
import userModel from '@/admin/models/userModel';
import { ReactComponent as Logo } from '@/assets/pico-logo.svg';
import { picoApiAxios, request } from '@/api/picoApi';
import { PRIVATE_PATH, uiClsPrefix, PUBLIC_PATH } from '@/utils/const';
import { isPrivate, webRoutePublicPath } from '@/utils/env';
import '@arco-design/theme-tech-pico/index.less';
import '@arco-design/theme-tech-pico/css/arco.css';
import '../style/index.global.less';
import '@byted-tech/community/es/css/all.min.css';

const MenuItem = Menu.Item;
const { SubMenu } = Menu;
const { Sider } = Layout;
const { Header } = Layout;
const { Footer } = Layout;
const { Content } = Layout;

Modal.config({ prefixCls: uiClsPrefix });

const App = ({ Component, ...pageProps }: { Component: any }) => {
  const history = useHistory();
  const [{ isInited, error, isError, isAdmin, needLogin }, userActions] = useModel(userModel);
  const [{ pathConfig, currentPathConfig, currentPath }, { setCurrentPath }] = useModel(AppModel);
  const [collapse, setCollapse] = useState(false);
  const match = useRouteMatch();
  const handleCollapsed = (val: boolean) => {
    setCollapse(val);
  };
  // 用户信息初始化
  useEffect(() => {
    picoApiAxios.interceptors.response.use(
      response => response,
      reqError => {
        if (reqError?.data?.err_no) {
          if (reqError?.config?.slient) {
            console.log('静默处理');
            // 配置静默处理
          } else {
            Message.error(reqError?.data?.err_msg || '请求异常');
          }

          return Promise.reject(reqError);
        }

        Message.error(reqError.message || '网络出错了');
        return Promise.reject(reqError);
      },
    );
    userActions.fetch();
  }, []);

  // 页面使用模板检查
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
                  <IconHome />
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
          subTitle={needLogin ? '当前未登录，请先去首页登录哦!' : '无管理员权限哦！'}
          extra={
            < a href= >
              <Button type="primary">去首页</Button>
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
    <AdminProvider
      customRequest={request}
      path={{
        user: `/${isPrivate() ? PRIVATE_PATH : PUBLIC_PATH}/user/:id`,
      }}>
      <ConfigProvider prefixCls={uiClsPrefix}>{$content}</ConfigProvider>
    </AdminProvider>
  );
};
export default App;