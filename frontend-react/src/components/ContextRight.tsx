import React, { Context, useEffect, useState } from "react";
import { Input, Spin } from 'antd';
import { Layout, Form, Button, Alert } from 'antd';
const { Content } = Layout;
import { useActiveCtx } from "../hooks/ActiveContext";

import type { FormProps } from 'antd';

const { TextArea } = Input;

interface ContextModel {
    id: string;
    name: string;
    description: string;
    postive: string;
    negative: string;
};

const ContextArea = () => {

    const [form] = Form.useForm();
    const [formDisibled, setFormDisibled] = useState(true);
    const [formLoading, setFormLoading] = useState(false);
    const [notifyState, setNotifyState] = useState('');
    
    const { activeCtx, setActiveCtx } = useActiveCtx();
    const [ctxModel, setCtxModel] = useState<ContextModel>({
        id: '', name: 'x', description: 'x', postive: 'x', negative: 'x'
    })

    // Bind data change event
    useEffect(() => {
        
    }, []);

    useEffect(() => {
        setFormDisibled(true);
        setFormLoading(true);
        setTimeout(()=>{
            ctxModel.name = activeCtx;
            form.setFieldsValue(ctxModel);
            setNotifyState('');
            setFormDisibled(false);
            setFormLoading(false);
        }, 1000);
        console.log("new script selected: ", activeCtx)
    }, [activeCtx]);

    const handleSubmit = () => {
        setFormDisibled(true);
        setFormLoading(true);
        setTimeout(() => {
            setNotifyState("SUC:successfully updated");
            setFormDisibled(false);
            setFormLoading(false);
        }, 1000);
    };

    const notifyPop = () => {
        if('' == notifyState){
            return (<span></span>)
        }else if(notifyState.startsWith("SUC:")){
            return (<Alert showIcon message={notifyState.substring(4)} type="success" />);
        }else if(notifyState.startsWith("FAIL:")){
            return (<Alert showIcon message={notifyState.substring(5)} type="error" />);
        }else{
            return (<Alert showIcon message={notifyState} type="warning" />);
        }
    };

    return (
        <Content style={{ padding: '0 24px' }}>
            <div
                style={{
                    textAlign: 'center',
                    marginTop: 12,
                    marginBottom: 50,
                    height: 32,
                    lineHeight: '32px',
                    fontSize: '32px'
                }}
            >
                Context
            </div>
            <Spin spinning={formLoading}>
                <Form
                    form={form}
                    labelCol={{ span: 7 }}
                    wrapperCol={{ span: 20 }}
                    layout="horizontal"
                    style={{ maxWidth: 600 }}
                    disabled={formDisibled}
                >
                    <Form.Item name="name" label="Name" >
                        <Input />
                    </Form.Item>
                    <Form.Item label="Description" name="description">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Positive Promotion" name="positive">
                        <TextArea rows={4} />
                    </Form.Item>
                    <Form.Item label="Negative Promotion" name="negative">
                        <TextArea rows={4} />
                    </Form.Item>
                    <Form.Item label=" "  colon={false}>
                    <Button type="primary" onClick={handleSubmit}>Submit</Button>
                    <Button type="primary" onClick={handleSubmit}>Create</Button>
                    </Form.Item>
                    <Form.Item label=" "  colon={false}>
                        {notifyPop()}
                    </Form.Item>
                </Form>
            </Spin>
        </Content>
    );
};

export default ContextArea;