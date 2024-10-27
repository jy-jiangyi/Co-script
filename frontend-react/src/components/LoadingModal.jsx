import React from 'react';
import { Modal, Spin } from 'antd';

const LoadingModal = ({ visible }) => {
    return (
        <Modal
            title={null} // 不需要标题
            visible={visible}
            footer={null}
            centered
            closable={false} // 禁用关闭按钮
            maskClosable={false} // 禁止点击遮罩层关闭
        >
            <div style={{ textAlign: 'center', padding: '20px' }}>
                <Spin tip="Loading..." size="large" />
            </div>
        </Modal>
    );
};

export default LoadingModal;
