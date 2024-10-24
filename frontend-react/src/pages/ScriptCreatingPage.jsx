import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from 'antd';

const ScriptGenerationPage = () => {
    const [scriptName, setScriptName] = useState('');
    const [source, setSource] = useState('None');  // 将 source 的初始值设为 "None"
    const [positivePrompt, setPositivePrompt] = useState('');
    const [negativePrompt, setNegativePrompt] = useState('');
    const [scriptContent, setScriptContent] = useState('');  // 用来管理用户输入的脚本内容
    const [language, setLanguage] = useState('');            // 翻译语言


    const [isModalOpen, setIsModalOpen] = useState(false);  // 控制弹窗显示状态
    const [modalContexts, setModalContexts] = useState([]);  // 用于弹窗中的分页数据
    const [selectedContexts, setSelectedContexts] = useState([]);  // 用户选择的上下文列表
    const [currentPage, setCurrentPage] = useState(0);  // 当前页码，从0开始
    const [totalPages, setTotalPages] = useState(0);  // 总页数
    const [amount, setAmount] = useState(5);  // 每页显示的数量

    const navigate = useNavigate();  // 初始化 navigate


    // const allContexts = [
    //     { id: 1, title: 'Love' },
    //     { id: 2, title: 'Peace' },
    //     { id: 3, title: 'Adventure' },
    //     { id: 4, title: 'Mystery' },
    //     { id: 5, title: 'Friendship' },
    //     { id: 6, title: 'Courage' },
    //     { id: 7, title: 'Dream' },
    //     { id: 8, title: 'Hope' },
    //     { id: 9, title: 'Freedom' },
    //     { id: 10, title: 'Truth' }
    // ];

    useEffect(() => {
        fetchContexts(currentPage, amount);  // 页面加载时获取第一页的数据
    }, [currentPage, amount]);

// 修改后的 fetchContexts 方法，调用后端 API 获取上下文数据
    const fetchContexts = (page, amount) => {
        fetch(`/context/creator?offset=${page * amount}&amount=${amount}`)
            .then(response => response.json())
            .then(data => {
                // `data.content` 包含上下文列表
                setModalContexts(data.content);  // 设置上下文列表
                setTotalPages(data.totalPages);  // 设置总页数
            })
            .catch(error => console.error('Error fetching contexts:', error));
    };

    // 处理翻页按钮点击事件
    const handlePreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);  // 切换到上一页
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(currentPage + 1);  // 切换到下一页
        }
    };

    // 打开弹窗
    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    // 关闭弹窗
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    // 用户选择上下文
    const handleSelectContext = (context) => {
        setSelectedContexts([...selectedContexts, context.title]);  // 添加选择的上下文到用户上下文列表
        handleCloseModal();  // 选择后关闭弹窗
    };


    const deleteContext = (indexToDelete) => {
        setSelectedContexts(selectedContexts.filter((_, index) => index !== indexToDelete));
    };

    const handleGenerateScript = () => {
        // 构建基础请求体
        const requestBody = {
            name: scriptName,
            contextList: selectedContexts,
            positive: positivePrompt,
            negative: negativePrompt,
        };

        // 如果 source 不是 None，则包含 existingScript 字段
        if (source !== 'None') {
            requestBody.existingScript = scriptContent;
        }

        // 根据 source 选择不同的端点和请求内容
        let apiEndpoint = '';
        if(source === 'None') {
            apiEndpoint = '/scripts/generate';
        } else if (source === 'emulation') {
            apiEndpoint = '/scripts/emulate';
        } else if (source === 'rewriting') {
            apiEndpoint = '/scripts/rewrite';
        } else if (source === 'translation') {
            apiEndpoint = '/scripts/translate';
            requestBody.language = language;
        }


        // 输出请求体以验证构建是否正确
        console.log('Request Body:', requestBody);

        // 发送 POST 请求
        fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        })
            .then(response => response.text())  // 使用 text() 代替 json() 以检查原始响应
            .then(text => {
                console.log('Raw Response:', text);
                try {
                    const data = JSON.parse(text);  // 尝试将文本转换为 JSON
                    Modal.success({
                        title: 'Success',
                        content: data.message,  // 显示成功提示
                        onOk: () => {
                            navigate('/script_management');  // 用户点击OK后跳转到 script_management 页面
                        }
                    });
                    console.log('Parsed Data:', data);
                } catch (error) {
                    console.error('JSON Parsing Error:', error);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };


    const styles = {
        container: {
            fontFamily: 'Arial, sans-serif',
            padding: '20px',
            overflow: 'auto',
        },
        header: {
            paddingBottom: '20px',
            textAlign: 'center'
        },
        form: {
            maxWidth: '800px',
            margin: '0 auto',
        },
        formGroup: {
            marginBottom: '20px',
        },

        label: {
            display: 'block',
            marginBottom: '5px',
            fontWeight: 'bold',
        },
        input: {
            width: '100%',
            padding: '8px',
            marginBottom: '10px',
            boxSizing: 'border-box',
        },
        contextContainer: {
            marginBottom: '20px',
        },
        promptContainer: {
            display: 'block',  // 将flex布局改为block布局使输入框竖直排列
        },
        promptInput: {
            width: '100%',     // 保持输入框的宽度为100%
            padding: '8px',
            marginBottom: '10px',  // 添加输入框之间的间距
            boxSizing: 'border-box',
        },
        generateButton: {
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '20px',
            display: 'block',
            margin: '0 auto',

        },
        textArea: {
            width: '100%',           // 占满容器宽度
            height: '150px',         // 设定高度
            padding: '10px',         // 内边距
            marginTop: '10px',       // 与上方的选择框分开
            fontSize: '16px',        // 字体大小
            borderRadius: '4px',     // 圆角
            borderColor: '#ccc',     // 边框颜色
            boxSizing: 'border-box', // 让输入框宽度包括内边距
        },
        deleteButton: {
            marginLeft: '5px',
            backgroundColor: 'transparent',  // 透明背景
            color: 'red',  // 图标颜色
            border: 'none',
            cursor: 'pointer',
            padding: '2px',
        },
        modalOverlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',  // 背景半透明
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
        modal: {
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            width: '300px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        },
        contextList: {
            listStyleType: 'none',
            padding: 0,
        },
        contextItem: {
            padding: '10px',
            cursor: 'pointer',
            backgroundColor: '#f0f0f0',
            marginBottom: '10px',
            borderRadius: '4px',
            textAlign: 'center',
            fontWeight: 'bold',
            color: '#007bff',
        },
        button: {
            padding: '5px 10px',
            cursor: 'pointer',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            marginTop: '20px',
        },
        paginationControls: {
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '10px',
            marginBottom: '20px',  // 给 "Close" 按钮留出更多空间
        },
    };

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1>Script Creating</h1>
            </header>

            <div style={styles.form}>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Name</label>
                    <input
                        type="text"
                        value={scriptName}
                        onChange={(e) => setScriptName(e.target.value)}
                        placeholder="New Script"
                        style={styles.input}
                    />
                </div>

                <div style={styles.formGroup}>
                    <label style={styles.label}>Source</label>
                    <select value={source} onChange={(e) => setSource(e.target.value)} style={styles.input}>
                        <option value="None">None</option>
                        <option value="emulation">emulation</option>
                        <option value="rewriting">rewriting</option>
                        <option value="translation">translation</option>
                    </select>

                    {/* 当 source 不是 None 时，显示脚本输入框 */}
                    {source !== 'None' && (
                        <textarea
                            value={scriptContent}
                            onChange={(e) => setScriptContent(e.target.value)}
                            placeholder={`Please enter the ${source} script from your library`}
                            style={styles.textArea}
                        />
                    )}

                    {/* 当 source 是 translation 时，显示翻译语言输入框 */}
                    {source === 'translation' && (
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Language</label>
                            <input
                                type="text"
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                placeholder="Please enter the translation language"
                                style={styles.input}  // 与其他输入框保持一致的样式
                            />
                        </div>
                    )}
                </div>

                <div>
                    <div style={styles.contextContainer}>
                        <label style={styles.label}>Context</label>
                        {selectedContexts.length === 0 ? (
                            <p>Please add context</p>  // 如果没有上下文，提示用户添加
                        ) : (
                            selectedContexts.map((context, index) => (
                                <span key={index} style={styles.contextItem}>
                            {context}
                                    <button
                                        style={styles.deleteButton}
                                        onClick={() => deleteContext(index)}
                                    >
                                ×
                            </button>
                        </span>
                            ))
                        )}
                        <button style={styles.button} onClick={handleOpenModal}>+ New Context</button>

                        {/* 弹窗 */}
                        {isModalOpen && (
                            <div style={styles.modalOverlay}>
                                <div style={styles.modal}>
                                    <h3>Select a Context from your Library</h3>
                                    <ul style={styles.contextList}>
                                        {modalContexts.map((context) => (
                                            <li key={context.id} style={styles.contextItem}
                                                onClick={() => handleSelectContext(context)}>
                                                {context.title}
                                            </li>
                                        ))}
                                    </ul>
                                    {/* 分页控制 */}
                                    <div style={styles.paginationControls}>
                                        <button onClick={handlePreviousPage} disabled={currentPage === 0}>
                                            Previous
                                        </button>
                                        <span>Page {currentPage + 1} of {totalPages}</span>
                                        <button onClick={handleNextPage} disabled={currentPage === totalPages - 1}>
                                            Next
                                        </button>
                                    </div>
                                    <button style={styles.button} onClick={handleCloseModal}>Close</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div style={styles.formGroup}>
                    <label style={styles.label}>Prompt</label>
                    <div style={styles.promptContainer}>
                        <div>
                            <label style={styles.label}>Positive</label>
                            <input
                                type="text"
                                value={positivePrompt}
                                onChange={(e) => setPositivePrompt(e.target.value)}
                                placeholder="Please enter the positive prompt"
                                style={styles.promptInput}
                            />
                        </div>
                        <div>
                            <label style={styles.label}>Negative</label>
                            <input
                                type="text"
                                value={negativePrompt}
                                onChange={(e) => setNegativePrompt(e.target.value)}
                                placeholder="Please enter the negative prompt"
                                style={styles.promptInput}
                            />
                        </div>
                    </div>
                </div>

                <button style={styles.generateButton} onClick={handleGenerateScript}>
                    Generation
                </button>
            </div>
        </div>
    );
};

export default ScriptGenerationPage;
