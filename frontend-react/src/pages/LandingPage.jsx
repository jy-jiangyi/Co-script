import React from 'react';
import {Typography} from 'antd';
import '../styles/Landing.css';

const {Title, Paragraph} = Typography;

const LandingPage = () => {
    return (
        <div className="landing-container">
            <Title level={1} className="rainbow-text">
                Co-Script
            </Title>
            <Paragraph className="intro-text">
                Collaborate Intelligently. Create Remarkably.
            </Paragraph>
        </div>
    );
};

export default LandingPage;

