// 图表管理
class ChartManager {
    constructor() {
        this.dashboardCharts = {};
        this.analyticsCharts = {};
        this.init();
    }

    init() {
        this.initDashboardCharts();
        window.addEventListener('resize', () => this.handleResize());
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

        this.dashboardCharts = {
            chart1: chart1,
            chart2: chart2
        };
    }

    // 初始化分析图表
    initAnalyticsCharts() {
        const chart1 = echarts.init(document.getElementById('analytics-chart1'));
        const chart2 = echarts.init(document.getElementById('analytics-chart2'));
        
        this.analyticsCharts = {
            chart1: chart1,
            chart2: chart2
        };
        
        // 初始更新
        this.updateAnalyticsCharts();
    }

    // 更新分析图表
    updateAnalyticsCharts() {
        if (!this.analyticsCharts.chart1 || !this.analyticsCharts.chart2) {
            this.initAnalyticsCharts();
            return;
        }

        const analysisType = document.getElementById('analysis-type')?.value || 'temperature';
        const timeRange = document.getElementById('time-range')?.value || '24h';
        
        this.updateAnalyticsData(analysisType, timeRange);
    }

    // 更新分析数据
    updateAnalyticsData(type, timeRange) {
        const timeData = this.generateAnalyticsTimeData(timeRange);
        const chartData = this.generateAnalyticsChartData(type, timeRange);
        const stats = this.calculateStats(chartData.data, type);

        // 更新图表1 - 时间序列数据
        this.analyticsCharts.chart1.setOption({
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
        
        this.analyticsCharts.chart2.setOption({
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
        let ranges;
        
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

    // 处理窗口大小变化
    handleResize() {
        // 重绘所有图表
        Object.values(this.dashboardCharts).forEach(chart => {
            if (chart) chart.resize();
        });
        Object.values(this.analyticsCharts).forEach(chart => {
            if (chart) chart.resize();
        });
    }

    // 切换到分析页面时调用
    showAnalyticsCharts() {
        if (!this.analyticsCharts.chart1) {
            this.initAnalyticsCharts();
        }
        this.handleResize();
    }

    // 销毁图表实例
    dispose() {
        Object.values(this.dashboardCharts).forEach(chart => {
            if (chart) chart.dispose();
        });
        Object.values(this.analyticsCharts).forEach(chart => {
            if (chart) chart.dispose();
        });
    }
}

// 初始化图表管理器
const chartManager = new ChartManager();
window.chartManager = chartManager;

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChartManager;
}