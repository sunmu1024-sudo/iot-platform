const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3001;

// 中间件
app.use(cors());
app.use(bodyParser.json());

// 模拟数据库
let devices = [
  { 
    id: 'DEV001', name: '温度传感器-01', type: '温度传感器', status: 'online',
    location: '实验室A区', battery: 85, signal: '强', lastReport: new Date().toISOString(),
    temperature: 23.5, humidity: 65
  },
  { 
    id: 'DEV002', name: '湿度传感器-01', type: '湿度传感器', status: 'online',
    location: '实验室B区', battery: 92, signal: '中', lastReport: new Date().toISOString(),
    temperature: 22.8, humidity: 70
  },
  { 
    id: 'DEV003', name: '光照传感器-01', type: '光照传感器', status: 'online',
    location: '实验室C区', battery: 78, signal: '强', lastReport: new Date().toISOString(),
    temperature: 24.2, humidity: 68
  }
];

let nodes = [
  {
    id: 'NODE001', name: '边缘节点-01', status: 'online',
    cpu: 45, memory: 62, storage: 35, network: 28,
    devices: 8, location: '实验室中心', lastActive: new Date().toISOString()
  }
];

let warnings = [
  {
    id: 'WARN001', type: 'critical', title: '温度异常警告',
    message: '温度传感器-03检测到温度超过阈值：35.6°C',
    time: new Date().toISOString(), node: '边缘节点-02', resolved: false
  },
  {
    id: 'WARN002', type: 'warning', title: '电池电量低',
    message: '设备 DEV003 电池电量低于20%',
    time: new Date().toISOString(), node: '边缘节点-01', resolved: false
  }
];

// 设备管理API
app.get('/api/devices', (req, res) => {
  res.json({
    success: true,
    data: devices,
    total: devices.length
  });
});

app.post('/api/devices', (req, res) => {
  const { name, type, location, battery } = req.body;
  
  if (!name || !type || !location) {
    return res.status(400).json({
      success: false,
      message: '缺少必要参数'
    });
  }

  const newDevice = {
    id: 'DEV' + (devices.length + 1).toString().padStart(3, '0'),
    name,
    type,
    status: 'online',
    location,
    battery: battery || 80,
    signal: '强',
    lastReport: new Date().toISOString(),
    temperature: 22 + Math.random() * 6,
    humidity: 60 + Math.random() * 20
  };

  devices.push(newDevice);
  
  res.json({
    success: true,
    data: newDevice,
    message: '设备添加成功'
  });
});

app.put('/api/devices/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  
  const deviceIndex = devices.findIndex(d => d.id === id);
  if (deviceIndex === -1) {
    return res.status(404).json({
      success: false,
      message: '设备不存在'
    });
  }

  devices[deviceIndex] = { ...devices[deviceIndex], ...updates };
  
  res.json({
    success: true,
    data: devices[deviceIndex],
    message: '设备更新成功'
  });
});

app.delete('/api/devices/:id', (req, res) => {
  const { id } = req.params;
  
  const deviceIndex = devices.findIndex(d => d.id === id);
  if (deviceIndex === -1) {
    return res.status(404).json({
      success: false,
      message: '设备不存在'
    });
  }

  devices.splice(deviceIndex, 1);
  
  res.json({
    success: true,
    message: '设备删除成功'
  });
});

// 边缘节点API
app.get('/api/nodes', (req, res) => {
  res.json({
    success: true,
    data: nodes,
    total: nodes.length
  });
});

app.post('/api/nodes', (req, res) => {
  const { name, location, capacity } = req.body;
  
  if (!name || !location) {
    return res.status(400).json({
      success: false,
      message: '缺少必要参数'
    });
  }

  const newNode = {
    id: 'NODE' + (nodes.length + 1).toString().padStart(3, '0'),
    name,
    status: 'online',
    cpu: 20 + Math.random() * 30,
    memory: 30 + Math.random() * 40,
    storage: 20 + Math.random() * 30,
    network: 15 + Math.random() * 25,
    devices: 0,
    location,
    capacity,
    lastActive: new Date().toISOString()
  };

  nodes.push(newNode);
  
  res.json({
    success: true,
    data: newNode,
    message: '节点添加成功'
  });
});

// 警告中心API
app.get('/api/warnings', (req, res) => {
  const { resolved } = req.query;
  let filteredWarnings = warnings;
  
  if (resolved !== undefined) {
    filteredWarnings = warnings.filter(w => w.resolved === (resolved === 'true'));
  }
  
  res.json({
    success: true,
    data: filteredWarnings,
    total: filteredWarnings.length
  });
});

app.put('/api/warnings/:id/resolve', (req, res) => {
  const { id } = req.params;
  
  const warningIndex = warnings.findIndex(w => w.id === id);
  if (warningIndex === -1) {
    return res.status(404).json({
      success: false,
      message: '警告不存在'
    });
  }

  warnings[warningIndex].resolved = true;
  
  res.json({
    success: true,
    data: warnings[warningIndex],
    message: '警告已处理'
  });
});

// 数据分析API
app.get('/api/analytics/data', (req, res) => {
  const { range = '24h' } = req.query;
  
  const analyticsData = generateAnalyticsData(range);
  
  res.json({
    success: true,
    data: analyticsData,
    range
  });
});

function generateAnalyticsData(range) {
  const now = new Date();
  let timeLabels = [];
  let temperature = [];
  let humidity = [];
  let light = [];

  if (range === '24h') {
    for (let i = 0; i < 24; i++) {
      const hour = (now.getHours() - 23 + i + 24) % 24;
      timeLabels.push(`${hour.toString().padStart(2, '0')}:00`);
      
      let baseTemp;
      if (hour >= 6 && hour <= 18) {
        baseTemp = 22 + Math.sin((hour - 6) / 12 * Math.PI) * 6;
      } else {
        baseTemp = 18 + Math.sin((hour + 6) / 12 * Math.PI) * 4;
      }
      
      const randomFactor = (Math.random() - 0.5) * 3;
      temperature.push(parseFloat((baseTemp + randomFactor).toFixed(1)));
      
      let baseHumidity = 70 - (temperature[i] - 22) * 2;
      baseHumidity += (Math.random() - 0.5) * 10;
      humidity.push(Math.max(40, Math.min(90, Math.round(baseHumidity))));
      
      let baseLight;
      if (hour >= 6 && hour <= 18) {
        baseLight = 300 + Math.sin((hour - 6) / 12 * Math.PI) * 600;
      } else {
        baseLight = 50 + Math.random() * 50;
      }
      baseLight += (Math.random() - 0.5) * 100;
      light.push(Math.max(0, Math.round(baseLight)));
    }
  } else if (range === '7d') {
    timeLabels = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    for (let i = 0; i < 7; i++) {
      let baseTemp = 22 + (i === 5 || i === 6 ? 2 : 0);
      baseTemp += (Math.random() - 0.5) * 4;
      temperature.push(parseFloat(baseTemp.toFixed(1)));
      
      let baseHumidity = 65 - (temperature[i] - 22) * 3;
      baseHumidity += (Math.random() - 0.5) * 15;
      humidity.push(Math.max(40, Math.min(85, Math.round(baseHumidity))));
      
      let baseLight = 500 + (Math.random() - 0.5) * 200;
      light.push(Math.round(baseLight));
    }
  }

  return { timeLabels, temperature, humidity, light };
}

// 系统统计API
app.get('/api/stats', (req, res) => {
  const onlineDevices = devices.filter(d => d.status === 'online').length;
  const offlineDevices = devices.filter(d => d.status !== 'online').length;
  const warningNodes = nodes.filter(n => n.status !== 'online').length;
  const unresolvedWarnings = warnings.filter(w => !w.resolved).length;
  const avgTemperature = devices.reduce((sum, d) => sum + (d.temperature || 0), 0) / devices.length;
  
  res.json({
    success: true,
    data: {
      onlineDevices,
      offlineDevices,
      totalNodes: nodes.length,
      warningNodes,
      unresolvedWarnings,
      avgTemperature: avgTemperature || 23.5
    }
  });
});

// 实时数据API
app.get('/api/realtime', (req, res) => {
  const onlineDevices = devices
    .filter(d => d.status === 'online')
    .slice(0, 5)
    .map(device => ({
      ...device,
      lastReport: '刚刚'
    }));
  
  res.json({
    success: true,
    data: onlineDevices,
    timestamp: new Date().toISOString()
  });
});

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: '5G边缘计算平台API服务运行正常',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 5G边缘计算平台API服务运行在 http://localhost:${PORT}`);
  console.log(`📊 健康检查: http://localhost:${PORT}/api/health`);
});