const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: ['http://localhost:5175', 'http://localhost:5174', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json({ limit: '100mb' }));

// 存储接收到的数据
const receivedData = {
  errors: [],
  performance: [],
  behavior: [],
  sessionReplay: []
};

// 错误上报端点
app.post('/api/report', (req, res) => {
  const data = req.body;
  console.log('\n=== 收到错误/性能数据 ===');
  console.log('Type:', data.type);
  console.log('SubType:', data.subType);
  console.log('Timestamp:', new Date(data.timestamp).toLocaleString());
  console.log('AppKey:', data.appKey);
  
  if (data.data) {
    console.log('Error Message:', data.data.message);
    console.log('Error Stack:', data.data.stack);
  }
  
  receivedData.errors.push({
    timestamp: data.timestamp,
    type: data.type,
    data: data.data
  });
  
  res.json({ success: true, message: '数据已接收' });
});

// Session Replay 上报端点
app.post('/api/session-replay', (req, res) => {
  const data = req.body;
  console.log('\n=== 收到 Session Replay 数据 ===');
  console.log('Events count:', data.data?.events?.length || 0);
  console.log('Session ID:', data.sessionId);
  console.log('Duration:', data.data?.duration);
  
  receivedData.sessionReplay.push({
    timestamp: data.timestamp,
    sessionId: data.sessionId,
    eventsCount: data.data?.events?.length || 0
  });
  
  res.json({ success: true, message: 'Session replay 数据已接收' });
});

// 获取所有接收到的数据
app.get('/api/data', (req, res) => {
  res.json(receivedData);
});

// 清空数据
app.delete('/api/clear', (req, res) => {
  receivedData.errors.length = 0;
  receivedData.performance.length = 0;
  receivedData.behavior.length = 0;
  receivedData.sessionReplay.length = 0;
  res.json({ success: true, message: '数据已清空' });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log('\n===========================================');
  console.log(`  监控服务器已启动！`);
  console.log(`  地址: http://localhost:${PORT}`);
  console.log('===========================================');
  console.log('\n可用端点:');
  console.log(`  POST /api/report       - 接收错误和性能数据`);
  console.log(`  POST /api/session-replay - 接收录屏数据`);
  console.log(`  GET  /api/data         - 获取所有接收的数据`);
  console.log(`  DELETE /api/clear      - 清空所有数据`);
  console.log('');
});
