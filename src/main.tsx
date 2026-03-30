import React, { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { init } from 'monitor-demo'

// 初始化监控SDK
const monitor = init({
  appKey: 'test-app-key',
  serverUrl: 'http://localhost:3001',
  debug: true,
  framework: {
    react: true
  },
  advanced: {
    enableSessionReplay: true,
    sessionReplaySampleRate: 1
  },
  reporter: {
    reportMethod: 'fetch',
    debug: true
  }
})

// 处理异步获取的ErrorBoundary
const AppWrapper = () => {
  const [ErrorBoundary, setErrorBoundary] = useState(null);

  useEffect(() => { 
    // 检查ErrorBoundary是否已经可用
    if (monitor.ErrorBoundary) {
      setErrorBoundary(monitor.ErrorBoundary);
    }

    // 使用定时器定期检查ErrorBoundary的可用性
    const interval = setInterval(() => {
      if (monitor.ErrorBoundary) {
        setErrorBoundary(monitor.ErrorBoundary);
        clearInterval(interval);
      }
    }, 100);

    // 清理定时器
    return () => clearInterval(interval);
  }, []);

  // 即使ErrorBoundary不可用，也使用React.Fragment包裹，确保结构一致
  const BoundaryComponent = ErrorBoundary || React.Fragment;
  
  return (
    <BoundaryComponent>
      <App monitor={monitor} />
    </BoundaryComponent>
  );
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppWrapper />
  </StrictMode>,
)
