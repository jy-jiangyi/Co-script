import React, { useEffect, useState } from "react";
import { Input, Skeleton } from 'antd';
import { List, Layout, Button, theme } from 'antd';
const { Content } = Layout;
import { useActiveCtx } from "../hooks/ActiveContext";
import axios from "axios";
const { Search } = Input;

let mockContextLeftIndex = 0;

interface ContextType {
    title?: string;
    description?: string;
    id: string;
    loading: boolean;
};

const loadEachTime = 3;

const ContextList = () => {

    const {activeCtx, setActiveCtx} = useActiveCtx();

    useEffect(() => {
        setListReloading(false)
    }, []);

    // Data: list data
    
    const [listReloading, setListReloading] = useState(true);
    const [loading, setLoading] = useState(false);
    const [keyword, setKeyword] = useState('');
    const [data, setData] = useState<{ [key: string]: ContextType }>({});
    const [ctxList, setCtxList] = useState<ContextType[]>([]);

    // Bind data and list object
    useEffect(() => {
        var p: ContextType[] = [];
        for(let key in data){
            p.push(data[key])
        }
        setCtxList(p);
        setLoading(false);
    }, [data]);

    useEffect(() => {
        if(loading){
            let newList = [...ctxList];
            for(let i=0; i<loadEachTime; i++){
                newList.push({
                    loading: true, title: '', description: '', id: '' 
                });
            }
            setCtxList(newList);
        }
    }, [loading]);

    // Reponse List event
    const onSearch = (value:string) => {
        setListReloading(true);
        setData({});
        setKeyword(value);
        axios.get('/context/search', {
            params: {
                keyword: value,
                offset: 0,
                amount: loadEachTime
            }
        }).then(response => {
            let newData = {}
            for(let ctx of response.data.content){
                newData[ctx.id] = ctx;
            }
            setData(newData);
        }).catch(error => {

        }).finally(() => {
            setListReloading(false);
        });
    };

    const handleEdit = (item:ContextType) => {
        setActiveCtx(item.id); 
    };

    const handleDel = (item:ContextType) => {
        setListReloading(true);
        axios.delete('/context/'+item.id)
            .then(response => {
                let newData = {...data};
                delete newData[item.id]
                setData(newData);
            }).catch(error => {

            }).finally(() => {
                setListReloading(false);
            });
    };

    const onLoadMore = () => {
        setLoading(true);
        axios.get('/context/search', {
            params: {
                keyword: keyword,
                offset: ctxList.length,
                amount: loadEachTime
            }
        }).then(response => {
            let newData = {}
            for(let ctx of response.data.content){
                newData[ctx.id] = ctx;
            }
            setData({...data, ...newData});
        }).catch(error => {

        }).finally(() => {
            setLoading(false);
        });
    };

    return (
        <Content style={{ padding: '0 24px' }}>
            <Search placeholder="input search text" onSearch={onSearch} style={{ width: '100%' }} />
            <Content style={{ padding: '0', margin: '10px 5px 10px 5px', width: '100%', height: '400px', overflow: 'auto' }}>
                <List
                    loading={listReloading}
                    itemLayout="horizontal"
                    loadMore={(
                        <div
                            style={{
                                textAlign: 'center',
                                marginTop: 12,
                                height: 32,
                                lineHeight: '32px',
                            }}
                        >
                            {!listReloading && !loading ?(
                                <Button onClick={onLoadMore}>loading more</Button>
                            ):(
                                <div>Loading...</div>
                            )}
                        </div>
                    )}
                    dataSource={ctxList}
                    renderItem={(item) => (
                        <List.Item
                            key={item.id}
                            actions={[(<Button 
                                color="primary" 
                                type="text"
                                onClick={()=>handleEdit(item)}>
                                Edit
                            </Button>), (<Button 
                                color="primary" 
                                type="text"
                                onClick={()=>handleDel(item)}>
                                Delete
                            </Button>)]}>
                            <Skeleton avatar title={false} loading={item.loading} active>
                                <List.Item.Meta
                                    title={item.title}
                                    description={item.description}
                                />
                            </Skeleton>
                        </List.Item>
                    )} />
            </Content>
        </Content>
    );
};

export default ContextList;