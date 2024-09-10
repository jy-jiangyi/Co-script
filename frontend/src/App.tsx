// App.tsx

import React from 'react';
import MyLayout from './components/MyLayout';
import { createRoot } from 'react-dom/client';

const App: React.FC = () => {
    return (
        <div>
            <MyLayout />
        </div>
    );
};

const mountNode = document.getElementById('mountNode');

if (mountNode) {
    createRoot(mountNode).render(<App />);
} else {
    console.error("Mount node not found");
}

export default App; // 确保这里有默认导出