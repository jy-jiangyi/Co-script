import {Layout, theme,} from "antd";

const {Header, Content, Footer} = Layout;

import WelcomeNavBar from "../components/WelcomeNavBar";

function WelcomeLayout({children}) {
    const {
        token: {colorBgContainer, borderRadiusLG},
    } = theme.useToken();
    return (
        <Layout className="layout">
            <Header style={{
                display: 'flex',
                alignItems: 'center',
            }}>
                <WelcomeNavBar/>
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

export default WelcomeLayout;