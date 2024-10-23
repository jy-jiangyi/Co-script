import React, { useState } from 'react';

const ScriptGenerationPage = () => {
    const [scriptName, setScriptName] = useState('');
    const [source, setSource] = useState('None');  // 将 source 的初始值设为 "None"
    const [contexts, setContexts] = useState(['Love', 'Peace']);
    const [positivePrompt, setPositivePrompt] = useState('');
    const [negativePrompt, setNegativePrompt] = useState('');
    const [scriptContent, setScriptContent] = useState('');  // 用来管理用户输入的脚本内容
    const [language, setLanguage] = useState('');            // 翻译语言


    const addNewContext = () => {
        setContexts([...contexts, `Context-${contexts.length + 1}`]);
    };

    const handleGenerateScript = () => {
        // 构建基础请求体
        const requestBody = {
            name: scriptName,
            contextList: contexts,
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
        contextItem: {
            display: 'inline-block',
            backgroundColor: '#f0f0f0',
            padding: '5px 10px',
            marginRight: '10px',
            borderRadius: '4px',
        },
        button: {
            padding: '5px 10px',
            cursor: 'pointer',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
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

                <div style={styles.contextContainer}>
                    <label style={styles.label}>Context</label>
                    {contexts.map((context, index) => (
                        <span key={index} style={styles.contextItem}>{context}</span>
                    ))}
                    <button style={styles.button} onClick={addNewContext}>+ New Context</button>
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
