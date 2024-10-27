import React, { useEffect, useState } from "react";
import { Layout, Button, theme, notification } from 'antd';
import { ActiveCtxProvider } from "../hooks/ActiveContext";
import ContextList from "../components/contextLeft";
import ContextArea from "../components/ContextRight";
import {TwitterTweetEmbed}  from 'react-twitter-embed';

const { Header, Content, Footer, Sider } = Layout;

const ContextManagementPage = () => {

    const [api, contextHolder] = notification.useNotification();

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    useEffect(() => {
    }, []);

    const notify = () => {
        api.open({
            message: 'Tweet',
            description:
            <TwitterTweetEmbed
            tweetId={'1850452587486806017'}
            />,
            duration: 0,
          });
    };

    return (
        <ActiveCtxProvider>
        <Content style={{ padding: '0 48px' }}>
            <Layout
                style={{ padding: '24px 0', background: colorBgContainer, borderRadius: borderRadiusLG }}
            >
                <Sider style={{ background: colorBgContainer }} width={'35%'}>
                    <ContextList />
                </Sider>
                <Content style={{ padding: '0 24px', minHeight: 280 }}>
                    <ContextArea />
                </Content>
            </Layout>
            <Button onClick={notify}>Tweet</Button>
            
        </Content>
        {contextHolder}
        </ActiveCtxProvider>
    );
}
export default ContextManagementPage;