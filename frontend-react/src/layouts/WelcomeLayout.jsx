import { Layout, theme } from "antd";
import WelcomeNavBar from "../components/WelcomeNavBar";
import { ActiveUserProvider } from "../hooks/UserContext";
import UserOp from "../components/UserOp";

const { Header, Content, Footer } = Layout;

function WelcomeLayout({ children }) {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    return (
        <ActiveUserProvider>
            <Layout
                className="layout"
                style={{
                    minHeight: '110vh',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Header
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <WelcomeNavBar />
                    <UserOp />
                </Header>
                <Content
                    style={{
                        flex: 1,
                    }}
                >
                    {children}
                </Content>
                <Footer
                    style={{
                        textAlign: 'center',
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <div style={{ marginRight: '200px' }}>
                            <h3>About Us</h3>
                            <p>Team Tue-05-08-Lab-Group-2</p>
                        </div>
                        <div>
                            <h3>Contact Us</h3>
                            <p>hsun0778@uni.sydney.edu.au</p>
                            <p>cson4680@uni.sydney.edu.au</p>
                            <p>yyan5712@uni.sydney.edu.au</p>
                            <p>yjia0546@uni.sydney.edu.au</p>
                            <p>huli0518@uni.sydney.edu.au</p>
                        </div>
                    </div>
                </Footer>
            </Layout>
        </ActiveUserProvider>
    );
}

export default WelcomeLayout;
