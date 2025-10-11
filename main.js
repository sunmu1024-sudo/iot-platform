// 主应用程序
class IoTPlatform {
    constructor() {
        this.currentPage = 'dashboard';
        this.analyticsData = {};
        this.init();
    }

    init() {
        this.initNavigation();
        this.initDevicesTable();
        this.initCharts();
        this.initEventListeners();
        this.startRealTimeUpdates();
    }

    // 初始化导航
    initNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = item.getAttribute('data-page');
                this.switchPage(page);
            });
        });
    }

    // 切换页面
    switchPage(page) {
        // 隐藏所有页面
        document.querySelectorAll('.page').forEach(p => {
            p.classList.remove('active');
        });

        // 移除所有活跃状态
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });

        // 显示目标页面
        document.getElementById(page).classList.add('active');
        
        // 设置活跃导航项
        document.querySelector(`[data-page="${page}"]`).classList.add('active');
        
        // 更新页面标题
        this.updatePageTitle(page);
        
        this.currentPage = page;
        
        // 更新页面特定内容
        this.updatePageContent(page);
    }

    // 更新页面标题
    updatePageTitle(page) {
        const titles = {
            'dashboard': '物联网平台监控中心',
            'devices': '设备管理',
            'analytics': '数据分析',
            'edge-nodes': '边缘节点管理',
            'warnings': '警告中心'
        };
        
        document.getElementById('page-title').textContent = titles[page] || '物联网平台';
    }

    // 更新页面内容
    updatePageContent(page) {
        if (page === 'analytics') {
            // 延迟确保DOM完全加载
            setTimeout(() => {
                this.updateAnalyticsCharts();
            }, 100);
        }
    }

    // 初始化设备表格
    initDevicesTable() {
        const devices = [
            { id: 'DEV001', name: '温度传感器-01', type: '温度传感器', status: 'online', lastReport: '2分钟前' },
            { id: 'DEV002', name: '湿度传感器-01', type: '湿度传感器', status: 'online', lastReport: '5分钟前' },
            { id: 'DEV003', name: '光照传感器-01', type: '光照传感器', status: 'warning', lastReport: '10分钟前' },
            { id: 'DEV004', name: '烟雾传感器-01', type: '烟雾传感器', status: 'offline', lastReport: '1小时前' },
            { id: 'DEV005', name: '摄像头-01', type: '视频设备', status: 'online', lastReport: '刚刚' }
        ];

        const tbody = document.getElementById('devices-tbody');
        tbody.innerHTML = '';

        devices.forEach(device => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${device.id}</td>
                <td>${device.name}</td>
                <td>${device.type}</td>
                <td><span class="status ${device.status}">${this.getStatusText(device.status)}</span></td>
                <td>${device.lastReport}</td>
                <td><button class="btn btn-sm" onclick="iotPlatform.viewDevice('${device.id}')">详情</button></td>
            `;
            tbody.appendChild(row);
        });
    }

    // 获取状态文本
    getStatusText(status) {
        const statusMap = { 'online': '在线', 'offline': '离线', 'warning': '警告' };
        return statusMap[status] || '未知';
    }

    // 查看设备详情
    viewDevice(deviceId) {
        alert(`查看设备 ${deviceId} 的详细信息`);
    }

    // 初始化图表
    initCharts() {
    // 使用 ChartManager 来管理图表
    if (window.chartManager) {
        window.chartManager.initDashboardCharts();
    } else {
        // 备用方案
        this.initDashboardCharts();
    }
}

// 更新页面内容
updatePageContent(page) {
    if (page === 'analytics') {
        // 延迟确保DOM完全加载
        setTimeout(() => {
            if (window.chartManager) {
                window.chartManager.showAnalyticsCharts();
                window.chartManager.updateAnalyticsCharts();
            } else {
                this.updateAnalyticsCharts();
            }
        }, 100);
    }
}

    // 初始化仪表板图表
    initDashboardCharts() {
        // 图表1 - 环境数据趋势
        const chart1 = echarts.init(document.getElementById('chart1'));
        chart1.setOption({
            title: { 
                text: '环境数据实时监测', 
                textStyle: { color: '#f1f5f9', fontSize: 16 },
                left: 'center'
            },
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(30, 41, 59, 0.9)',
                borderColor: '#334155'
            },
            legend: {
                data: ['温度', '湿度', '光照'],
                textStyle: { color: '#94a3b8' },
                top: 30
            },
            grid: {
                top: 80,
                bottom: 30,
                left: 60,
                right: 30,
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
                axisLine: { lineStyle: { color: '#475569' } },
                axisLabel: { color: '#94a3b8' }
            },
            yAxis: {
                type: 'value',
                axisLine: { lineStyle: { color: '#475569' } },
                axisLabel: { color: '#94a3b8' },
                splitLine: { lineStyle: { color: '#334155' } }
            },
            series: [
                {
                    name: '温度',
                    type: 'line',
                    data: [20, 19, 22, 25, 26, 23, 21],
                    smooth: true,
                    lineStyle: { color: '#ef4444', width: 3 },
                    itemStyle: { color: '#ef4444' }
                },
                {
                    name: '湿度',
                    type: 'line',
                    data: [60, 65, 68, 62, 58, 63, 65],
                    smooth: true,
                    lineStyle: { color: '#3b82f6', width: 3 },
                    itemStyle: { color: '#3b82f6' }
                },
                {
                    name: '光照',
                    type: 'line',
                    data: [0, 100, 500, 800, 600, 200, 0],
                    smooth: true,
                    lineStyle: { color: '#f59e0b', width: 3 },
                    itemStyle: { color: '#f59e0b' }
                }
            ]
        });

        // 图表2 - 设备状态分布
        const chart2 = echarts.init(document.getElementById('chart2'));
        chart2.setOption({
            title: { 
                text: '设备状态分布', 
                textStyle: { color: '#f1f5f9', fontSize: 16 },
                left: 'center'
            },
            tooltip: {
                trigger: 'item',
                backgroundColor: 'rgba(30, 41, 59, 0.9)',
                borderColor: '#334155'
            },
            series: [{
                type: 'pie',
                radius: ['40%', '70%'],
                center: ['50%', '55%'],
                data: [
                    { value: 24, name: '在线', itemStyle: { color: '#10b981' } },
                    { value: 1, name: '离线', itemStyle: { color: '#ef4444' } },
                    { value: 1, name: '警告', itemStyle: { color: '#f59e0b' } }
                ],
                label: { color: '#94a3b8' },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }]
        });

        this.chart1 = chart1;
        this.chart2 = chart2;
    }

    // 初始化分析图表
    initAnalyticsCharts() {
        const chart1 = echarts.init(document.getElementById('analytics-chart1'));
        const chart2 = echarts.init(document.getElementById('analytics-chart2'));
        
        this.analyticsChart1 = chart1;
        this.analyticsChart2 = chart2;
        
        // 初始化分析数据
        this.updateAnalyticsCharts();
    }

    // 更新分析图表
    updateAnalyticsCharts() {
        if (!this.analyticsChart1 || !this.analyticsChart2) {
            console.log('图表未初始化，重新初始化...');
            this.initAnalyticsCharts();
            return;
        }

        const analysisType = document.getElementById('analysis-type')?.value || 'temperature';
        const timeRange = document.getElementById('time-range')?.value || '24h';
        
        // 根据选择的分析类型和时间范围更新数据
        this.updateAnalyticsData(analysisType, timeRange);
    }

    // 更新分析数据
    updateAnalyticsData(type, timeRange) {
        const timeData = this.generateAnalyticsTimeData(timeRange);
        const chartData = this.generateAnalyticsChartData(type, timeRange);
        const stats = this.calculateStats(chartData.data, type);

        // 更新图表1 - 时间序列数据
        this.analyticsChart1.setOption({
            title: { 
                text: `${this.getTypeName(type)}变化趋势`, 
                textStyle: { color: '#f1f5f9', fontSize: 16 },
                left: 'center'
            },
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(30, 41, 59, 0.9)',
                borderColor: '#334155',
                formatter: (params) => {
                    let result = `<div style="font-weight:bold;margin-bottom:5px;">${params[0].name}</div>`;
                    params.forEach(param => {
                        const value = type === 'temperature' ? `${param.value}°C` : 
                                     type === 'humidity' ? `${param.value}%` : 
                                     `${param.value} Lux`;
                        result += `<div style="display:flex;align-items:center;">
                            <span style="display:inline-block;width:10px;height:10px;background:${param.color};margin-right:5px;border-radius:50%;"></span>
                            ${param.seriesName}: ${value}
                        </div>`;
                    });
                    return result;
                }
            },
            legend: {
                data: [this.getTypeName(type), '平均值', '预警线'],
                textStyle: { color: '#94a3b8' },
                top: 30
            },
            grid: {
                top: 80,
                bottom: 30,
                left: 60,
                right: 30,
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: timeData,
                axisLine: { lineStyle: { color: '#475569' } },
                axisLabel: { 
                    color: '#94a3b8',
                    rotate: timeData.length > 10 ? 45 : 0
                }
            },
            yAxis: {
                type: 'value',
                name: this.getTypeUnit(type),
                nameTextStyle: { color: '#94a3b8' },
                axisLine: { lineStyle: { color: '#475569' } },
                axisLabel: { color: '#94a3b8' },
                splitLine: { lineStyle: { color: '#334155', type: 'dashed' } }
            },
            series: [
                {
                    name: this.getTypeName(type),
                    type: 'line',
                    data: chartData.data,
                    smooth: true,
                    lineStyle: { 
                        color: chartData.color, 
                        width: 3 
                    },
                    itemStyle: { color: chartData.color },
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: `${chartData.color}33` },
                            { offset: 1, color: `${chartData.color}11` }
                        ])
                    },
                    markPoint: {
                        data: [
                            { type: 'max', name: '最大值' },
                            { type: 'min', name: '最小值' }
                        ]
                    },
                    markLine: {
                        data: [
                            { type: 'average', name: '平均值' }
                        ]
                    }
                },
                {
                    name: '平均值',
                    type: 'line',
                    data: Array(timeData.length).fill(stats.average),
                    lineStyle: { 
                        color: '#3b82f6', 
                        width: 2, 
                        type: 'dashed' 
                    },
                    itemStyle: { color: '#3b82f6' },
                    symbol: 'none'
                },
                {
                    name: '预警线',
                    type: 'line',
                    data: Array(timeData.length).fill(chartData.warningThreshold),
                    lineStyle: { 
                        color: '#f59e0b', 
                        width: 2, 
                        type: 'dashed' 
                    },
                    itemStyle: { color: '#f59e0b' },
                    symbol: 'none'
                }
            ]
        });

        // 更新图表2 - 数据统计
        this.updateAnalyticsStatsChart(type, chartData.data, stats);
        
        // 更新统计指标
        this.updateStatsDisplay(stats, type);
    }

    // 生成分析时间数据
    generateAnalyticsTimeData(timeRange) {
        switch(timeRange) {
            case '1h':
                return Array.from({ length: 12 }, (_, i) => {
                    const minutes = i * 5;
                    return `${Math.floor(minutes / 60).toString().padStart(2, '0')}:${(minutes % 60).toString().padStart(2, '0')}`;
                });
            case '6h':
                return Array.from({ length: 12 }, (_, i) => {
                    const minutes = i * 30;
                    return `${Math.floor(minutes / 60).toString().padStart(2, '0')}:${(minutes % 60).toString().padStart(2, '0')}`;
                });
            case '24h':
                return Array.from({ length: 24 }, (_, i) => {
                    return `${i.toString().padStart(2, '0')}:00`;
                });
            case '7d':
                return ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
            case '30d':
                return Array.from({ length: 30 }, (_, i) => {
                    return `${i + 1}日`;
                });
            default:
                return Array.from({ length: 24 }, (_, i) => {
                    return `${i.toString().padStart(2, '0')}:00`;
                });
        }
    }

    // 生成分析图表数据
    generateAnalyticsChartData(type, timeRange) {
        const dataPoints = this.getDataPointCount(timeRange);
        let baseValue, variation, warningThreshold, color;
        
        switch(type) {
            case 'temperature':
                baseValue = 23.5;
                variation = 8;
                warningThreshold = 28;
                color = '#ef4444';
                break;
            case 'humidity':
                baseValue = 65;
                variation = 20;
                warningThreshold = 80;
                color = '#3b82f6';
                break;
            case 'light':
                baseValue = 500;
                variation = 800;
                warningThreshold = 1000;
                color = '#f59e0b';
                break;
            default:
                baseValue = 23.5;
                variation = 8;
                warningThreshold = 28;
                color = '#ef4444';
        }
        
        // 生成带有时序特征的数据
        const data = Array.from({ length: dataPoints }, (_, i) => {
            let value;
            if (type === 'light') {
                // 光照数据模拟日夜变化
                const hour = this.getHourFromIndex(i, timeRange);
                const daylight = hour >= 6 && hour <= 18;
                const intensity = daylight ? 
                    Math.sin((hour - 6) / 12 * Math.PI) * 0.8 + 0.2 : 
                    Math.random() * 0.2;
                value = baseValue + intensity * variation;
            } else {
                // 温度和湿度数据模拟自然波动
                const trend = Math.sin(i / dataPoints * Math.PI * 2) * 0.3;
                const noise = (Math.random() - 0.5) * 0.4;
                value = baseValue + (trend + noise) * variation;
            }
            
            return type === 'temperature' ? Number(value.toFixed(1)) : Math.round(value);
        });
        
        return { data, color, warningThreshold };
    }

    // 获取数据点数量
    getDataPointCount(timeRange) {
        switch(timeRange) {
            case '1h': return 12;   // 5分钟间隔
            case '6h': return 12;   // 30分钟间隔
            case '24h': return 24;  // 1小时间隔
            case '7d': return 7;    // 天间隔
            case '30d': return 30;  // 天间隔
            default: return 24;
        }
    }

    // 从索引获取小时
    getHourFromIndex(index, timeRange) {
        switch(timeRange) {
            case '1h': return index * 5 / 60;
            case '6h': return index * 30 / 60;
            case '24h': return index;
            default: return index % 24;
        }
    }

    // 更新分析统计图表
    updateAnalyticsStatsChart(type, data, stats) {
        const distribution = this.calculateDistribution(data, type);
        
        this.analyticsChart2.setOption({
            title: { 
                text: '数据分布统计', 
                textStyle: { color: '#f1f5f9', fontSize: 16 },
                left: 'center'
            },
            tooltip: {
                trigger: 'item',
                backgroundColor: 'rgba(30, 41, 59, 0.9)',
                borderColor: '#334155',
                formatter: '{b}: {c}% ({d}%)'
            },
            legend: {
                orient: 'vertical',
                right: 10,
                top: 'center',
                textStyle: { color: '#94a3b8' }
            },
            series: [{
                type: 'pie',
                radius: ['40%', '70%'],
                center: ['40%', '50%'],
                data: distribution.data,
                label: { 
                    color: '#94a3b8',
                    formatter: '{b}: {c}%'
                },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }]
        });
    }

    // 计算数据分布
    calculateDistribution(data, type) {
        let ranges, colors;
        
        switch(type) {
            case 'temperature':
                ranges = [
                    { min: 0, max: 20, name: '低温', color: '#3b82f6' },
                    { min: 20, max: 25, name: '正常', color: '#10b981' },
                    { min: 25, max: 28, name: '注意', color: '#f59e0b' },
                    { min: 28, max: 100, name: '警告', color: '#ef4444' }
                ];
                break;
            case 'humidity':
                ranges = [
                    { min: 0, max: 30, name: '干燥', color: '#f59e0b' },
                    { min: 30, max: 70, name: '舒适', color: '#10b981' },
                    { min: 70, max: 100, name: '潮湿', color: '#3b82f6' }
                ];
                break;
            case 'light':
                ranges = [
                    { min: 0, max: 100, name: '黑暗', color: '#475569' },
                    { min: 100, max: 500, name: '昏暗', color: '#f59e0b' },
                    { min: 500, max: 1000, name: '明亮', color: '#eab308' },
                    { min: 1000, max: 5000, name: '强烈', color: '#ef4444' }
                ];
                break;
        }
        
        const counts = Array(ranges.length).fill(0);
        
        data.forEach(value => {
            for (let i = 0; i < ranges.length; i++) {
                if (value >= ranges[i].min && value < ranges[i].max) {
                    counts[i]++;
                    break;
                }
            }
        });
        
        const total = data.length;
        const distributionData = ranges.map((range, i) => ({
            value: Math.round((counts[i] / total) * 100),
            name: range.name,
            itemStyle: { color: range.color }
        }));
        
        return { data: distributionData };
    }

    // 计算统计指标
    calculateStats(data, type) {
        const sum = data.reduce((a, b) => a + b, 0);
        const average = sum / data.length;
        const max = Math.max(...data);
        const min = Math.min(...data);
        const range = max - min;
        const volatility = (range / average * 100).toFixed(1);
        
        return {
            average: type === 'temperature' ? Number(average.toFixed(1)) : Math.round(average),
            max: type === 'temperature' ? Number(max.toFixed(1)) : Math.round(max),
            min: type === 'temperature' ? Number(min.toFixed(1)) : Math.round(min),
            volatility: volatility + '%'
        };
    }

    // 更新统计显示
    updateStatsDisplay(stats, type) {
        const unit = this.getTypeUnit(type);
        
        document.getElementById('avg-value').textContent = 
            type === 'temperature' ? `${stats.average}${unit}` : `${stats.average}${unit}`;
        document.getElementById('max-value').textContent = 
            type === 'temperature' ? `${stats.max}${unit}` : `${stats.max}${unit}`;
        document.getElementById('min-value').textContent = 
            type === 'temperature' ? `${stats.min}${unit}` : `${stats.min}${unit}`;
        document.getElementById('volatility').textContent = stats.volatility;
    }

    // 获取类型名称
    getTypeName(type) {
        const names = {
            'temperature': '温度',
            'humidity': '湿度',
            'light': '光照'
        };
        return names[type] || '数据';
    }

    // 获取类型单位
    getTypeUnit(type) {
        const units = {
            'temperature': '°C',
            'humidity': '%',
            'light': ' Lux'
        };
        return units[type] || '';
    }

    // 初始化事件监听
    initEventListeners() {
        // 分析类型选择
        document.getElementById('analysis-type')?.addEventListener('change', (e) => {
            this.updateAnalyticsCharts();
        });

        // 时间范围选择
        document.getElementById('time-range')?.addEventListener('change', (e) => {
            this.updateAnalyticsCharts();
        });

        // 添加设备按钮
        document.querySelector('.btn-primary')?.addEventListener('click', () => {
            this.addDevice();
        });

        // 警告过滤器
        document.querySelectorAll('.warning-filters .btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.warning-filters .btn').forEach(b => {
                    b.classList.remove('active');
                });
                e.target.classList.add('active');
                this.filterWarnings(e.target.textContent);
            });
        });

        // 窗口调整
        window.addEventListener('resize', () => {
            this.chart1?.resize();
            this.chart2?.resize();
            this.analyticsChart1?.resize();
            this.analyticsChart2?.resize();
        });

        // 添加实时数据模拟
        this.startAnalyticsRealTimeUpdate();
    }

    // 开始分析数据实时更新
    startAnalyticsRealTimeUpdate() {
        // 每10秒更新一次数据（模拟实时数据流）
        setInterval(() => {
            if (this.currentPage === 'analytics') {
                this.updateAnalyticsCharts();
            }
        }, 10000);
    }

    // 添加设备
    addDevice() {
        const deviceName = prompt('请输入设备名称:');
        if (deviceName) {
            alert(`设备 ${deviceName} 添加成功！`);
            // 这里可以添加实际添加设备的逻辑
        }
    }

    // 过滤警告
    filterWarnings(filter) {
        const warnings = document.querySelectorAll('.warning-item');
        warnings.forEach(warning => {
            warning.style.display = 'flex';
            
            if (filter === '未处理') {
                if (warning.querySelector('.btn').textContent === '已处理') {
                    warning.style.display = 'none';
                }
            } else if (filter === '已处理') {
                if (warning.querySelector('.btn').textContent !== '已处理') {
                    warning.style.display = 'none';
                }
            }
        });
    }

    // 开始实时更新
    startRealTimeUpdates() {
        // 立即更新一次
        this.updateRealTimeData();
        
        // 每5秒更新一次
        setInterval(() => {
            this.updateRealTimeData();
        }, 5000);
    }

    // 更新实时数据
    updateRealTimeData() {
        // 更新传感器数据
        const dataItems = document.querySelectorAll('.data-item');
        dataItems.forEach(item => {
            const valueElement = item.querySelector('.sensor-value');
            const timeElement = item.querySelector('.sensor-time');
            
            if (valueElement.textContent.includes('°C')) {
                const newTemp = (Math.random() * 3 + 22).toFixed(1);
                valueElement.textContent = `${newTemp}°C`;
            } else if (valueElement.textContent.includes('%')) {
                const newHumidity = Math.floor(Math.random() * 10 + 60);
                valueElement.textContent = `${newHumidity}%`;
            } else if (valueElement.textContent.includes('Lux')) {
                const newLight = Math.floor(Math.random() * 300 + 600);
                valueElement.textContent = `${newLight} Lux`;
            }
            
            timeElement.textContent = '刚刚更新';
        });

        // 更新统计卡片数据（模拟变化）
        this.updateStatsCards();
    }

    // 更新统计卡片
    updateStatsCards() {
        const stats = document.querySelectorAll('.stat-card .value');
        if (stats.length > 0) {
            // 模拟在线设备数量变化
            const onlineDevices = Math.floor(Math.random() * 3) + 23; // 23-25之间
            stats[0].textContent = `${onlineDevices}台`;
            
            // 模拟温度变化
            const temp = (Math.random() * 2 + 22.5).toFixed(1); // 22.5-24.5之间
            stats[2].textContent = `${temp}°C`;
        }
    }

    // 处理警告操作
    handleWarningAction(button, warningItem) {
        const action = button.textContent;
        if (action === '紧急处理' || action === '标记处理') {
            button.textContent = '已处理';
            button.classList.remove('danger');
            button.classList.add('btn-sm');
            warningItem.classList.remove('critical', 'warning');
            warningItem.classList.add('info');
        }
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', function() {
    window.iotPlatform = new IoTPlatform();
    
    // 为警告操作按钮添加事件监听
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-sm') && 
            e.target.closest('.warning-actions')) {
            const warningItem = e.target.closest('.warning-item');
            window.iotPlatform.handleWarningAction(e.target, warningItem);
        }
    });
});