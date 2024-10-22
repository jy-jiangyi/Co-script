import React, { act, Context, useEffect, useState } from "react";
import { Input, Spin } from 'antd';
import { Layout, Form, Button, Alert } from 'antd';
const { Content } = Layout;
import { useActiveCtx } from "../hooks/ActiveContext";
import axios from 'axios';

const { TextArea } = Input;

interface ContextModel {
    id: string;
    title: string;
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
        id: '', title: '', description: '', postive: '', negative: ''
    })

    // Bind data change event
    useEffect(() => {
        
    }, []);

    useEffect(() => {
        if(activeCtx){
            setFormDisibled(true);
            setFormLoading(true);
            axios.get('/context/'+activeCtx)
            .then(response => {
                let newCtxModel = response.data;
                setCtxModel(newCtxModel);
                form.setFieldsValue(newCtxModel);
            }).catch(error => {
                setNotifyState('FAIL: failed to fetch '+activeCtx);
            }).finally(() => {
                setFormDisibled(false);
                setFormLoading(false);
            });
        }else{
            setFormDisibled(false);
            form.setFieldsValue(ctxModel);
        }
    }, [activeCtx]);

    const handleUpdate = () => {
        setFormDisibled(true);
        setFormLoading(true);
        let newCtx = {...ctxModel, ...form.getFieldsValue()};
        setCtxModel(newCtx);
        axios.put('/context/'+activeCtx, newCtx)
            .then(response => {
                setNotifyState("SUC:successfully updated");
            }).catch(error => {
                setNotifyState("FAIL:failed updated");
            }).finally(() => {
                setFormDisibled(false);
                setFormLoading(false);
            });
    };

    const handleCreate = () => {
        setFormDisibled(true);
        setFormLoading(true);
        axios.post("/context/", form.getFieldsValue())
            .then(response => {
                let newCtx = {...ctxModel, ...form.getFieldsValue()};
                newCtx.id = response.data;
                setCtxModel(newCtx);
                setNotifyState("SUC:successful create");
            })
            .catch(error => {
                setNotifyState("FAIL:error create");
            })
            .finally(() => {
                setFormDisibled(false);
                setFormLoading(false);
            });
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
                    <Form.Item name="title" label="Name" >
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
                    <Button type="primary" onClick={handleCreate}>Create</Button>
                    <Button type="primary" style={{marginLeft: 40}} onClick={handleUpdate} disabled={'' == ctxModel.id}>Update</Button>
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