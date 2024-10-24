import React, { useEffect, useState } from "react";
import { Layout, Button, theme } from 'antd';
import { ActiveCtxProvider } from "../hooks/ActiveContext";
import ContextList from "../components/contextLeft";
import ContextArea from "../components/ContextRight";

const { Header, Content, Footer, Sider } = Layout;

const ContextManagementPage = () => {

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    useEffect(() => {
    }, []);

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
        </Content>
        </ActiveCtxProvider>
    );
}
export default ContextManagementPage;