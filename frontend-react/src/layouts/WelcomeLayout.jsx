import {Layout, theme,} from "antd";

const {Header, Content, Footer} = Layout;

import WelcomeNavBar from "../components/WelcomeNavBar";
import { ActiveUserProvider } from "../hooks/UserContext";
import UserOp from "../components/UserOp";

function WelcomeLayout({children}) {
    const {
        token: {colorBgContainer, borderRadiusLG},
    } = theme.useToken();
    return (
        <ActiveUserProvider>
            <Layout className="layout">
                <Header style={{
                    display: 'flex',
                    alignItems: 'center',
                }}>
                    <WelcomeNavBar/>
                    <UserOp/>
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
        </ActiveUserProvider>
    )
}

export default WelcomeLayout;