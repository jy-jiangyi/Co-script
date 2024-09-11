import {Layout, theme,} from "antd";

const {Header, Content, Footer} = Layout;

import NavBar from "../components/NavBar";

function CommonLayout({children}) {
    const {
        token: {colorBgContainer, borderRadiusLG},
    } = theme.useToken();
    return (
        <Layout className="layout">
            <Header style={{
                display: 'flex',
                alignItems: 'center',
            }}>
                <NavBar/>
            </Header>
            <Content>
                {children}
            </Content>
            <Footer
                style={{
                    textAlign: 'center',
                }}
            >
                Ant Design ©2023 Created by Ant UED
            </Footer>
        </Layout>
    )
}

export default CommonLayout;