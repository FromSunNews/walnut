import { useState } from 'react';
import { ArrowLeft, Clock, Activity, Shield, Globe } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const TaskDetail = () => {
    const [taskData, setTaskData] = useState({
        // Thông tin cơ bản về task
        taskInfo: {
            id: "TASK-2024-03-A1B2C3",
            name: "AI Model Training Task",
            type: "AI Computing",
            status: "Active",
            priority: "High",
            createdAt: "2024-03-21T08:00:00Z",
            estimatedCompletion: "2024-03-21T16:00:00Z"
        },

        // Thông tin về cluster đang xử lý
        clusterInfo: {
            id: "CLUSTER-001",
            name: "AI Computing Cluster",
            nodesAssigned: 5,
            totalNodes: 10
        },

        // Thống kê hiệu suất
        performance: {
            progress: 65,
            lastUpdated: new Date().toLocaleTimeString(),
            metrics: {
                cpuUsage: "85%",
                gpuUsage: "92%",
                memoryUsage: "75%",
                networkUsage: "60%"
            },
            efficiency: {
                score: "92%",
                status: "Optimal"
            }
        },

        // Dữ liệu cho biểu đồ tiến độ
        progressHistory: Array.from({ length: 24 }, (_, i) => ({
            time: `${i}:00`,
            progress: Math.floor(Math.random() * 100)
        })),

        // Thông tin về tài nguyên
        resources: {
            allocated: {
                cpu: "32 cores",
                gpu: "4x RTX 3090",
                memory: "128GB RAM",
                storage: "2TB NVMe"
            },
            consumption: {
                power: "1200W",
                network: "850MB/s",
                cost: "45.5 SUI/hour"
            }
        },

        // Kết quả và phần thưởng
        results: {
            dataProcessed: "2.5TB",
            accuracy: "98.5%",
            errors: "0.02%",
            rewards: {
                total: "1,234.56 SUI",
                breakdown: {
                    base: "1,000 SUI",
                    bonus: "234.56 SUI"
                }
            }
        }
    });

    // Custom tooltip cho biểu đồ
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-sidebar/80 border border-sidebar-border/50 rounded p-2 text-sm">
                    <p className="text-sidebar-foreground">Progress: {payload[0].value}%</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Header */}
            <div className="border-b border-sidebar-border/50 p-4">
                <div className="flex items-center gap-4">
                    <button className="text-muted-foreground hover:text-foreground transition-colors">
                        <ArrowLeft className="h-4 w-4" />
                        Back to cluster
                    </button>
                </div>

                <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <h1 className="text-xl font-semibold">{taskData.taskInfo.name}</h1>
                        <span className="bg-sidebar-primary/20 text-sidebar-primary px-2 py-1 rounded-full text-sm">
                            {taskData.taskInfo.type}
                        </span>
                        <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-sm">
                            {taskData.taskInfo.status}
                        </span>
                        <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-sm">
                            Priority: {taskData.taskInfo.priority}
                        </span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="p-6 grid grid-cols-3 gap-6">
                {/* Left Column - Stats & Charts */}
                <div className="col-span-2 space-y-6">
                    {/* Progress Overview */}
                    <div className="bg-sidebar/30 rounded-lg p-6 border border-sidebar-border/50">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <div className="text-sm text-muted-foreground">Overall Progress</div>
                                <div className="text-2xl font-medium">{taskData.performance.progress}%</div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm text-muted-foreground">Last Updated</div>
                                <div>{taskData.performance.lastUpdated}</div>
                            </div>
                        </div>

                        {/* Progress Chart */}
                        <div className="h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={taskData.progressHistory}>
                                    <XAxis
                                        dataKey="time"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#6B7280', fontSize: 11 }}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#6B7280', fontSize: 11 }}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar
                                        dataKey="progress"
                                        fill="rgb(var(--sidebar-primary) / 0.3)"
                                        radius={[4, 4, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Performance Metrics */}
                    <div className="grid grid-cols-2 gap-4">
                        {Object.entries(taskData.performance.metrics).map(([key, value]) => (
                            <div key={key} className="bg-sidebar/30 rounded-lg p-4 border border-sidebar-border/50">
                                <div className="text-sm text-muted-foreground capitalize">
                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                </div>
                                <div className="text-2xl font-medium mt-1">{value}</div>
                            </div>
                        ))}
                    </div>

                    {/* Results Section */}
                    <div className="bg-sidebar/30 rounded-lg p-6 border border-sidebar-border/50">
                        <h3 className="text-lg font-medium mb-4">Results</h3>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <div className="text-sm text-muted-foreground">Data Processed</div>
                                <div className="text-xl font-medium">{taskData.results.dataProcessed}</div>
                            </div>
                            <div>
                                <div className="text-sm text-muted-foreground">Accuracy</div>
                                <div className="text-xl font-medium">{taskData.results.accuracy}</div>
                            </div>
                            <div>
                                <div className="text-sm text-muted-foreground">Error Rate</div>
                                <div className="text-xl font-medium">{taskData.results.errors}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                    {/* Task Information */}
                    <div className="bg-sidebar/30 rounded-lg p-4 border border-sidebar-border/50">
                        <h3 className="text-sm text-muted-foreground mb-4">Task Information</h3>
                        <div className="space-y-3">
                            <div>
                                <div className="text-sm text-muted-foreground">Task ID</div>
                                <div className="font-mono">{taskData.taskInfo.id}</div>
                            </div>
                            <div>
                                <div className="text-sm text-muted-foreground">Created At</div>
                                <div>{new Date(taskData.taskInfo.createdAt).toLocaleString()}</div>
                            </div>
                            <div>
                                <div className="text-sm text-muted-foreground">Estimated Completion</div>
                                <div>{new Date(taskData.taskInfo.estimatedCompletion).toLocaleString()}</div>
                            </div>
                        </div>
                    </div>

                    {/* Cluster Information */}
                    <div className="bg-sidebar/30 rounded-lg p-4 border border-sidebar-border/50">
                        <h3 className="text-sm text-muted-foreground mb-4">Cluster Information</h3>
                        <div className="space-y-3">
                            <div>
                                <div className="text-sm text-muted-foreground">Cluster Name</div>
                                <div>{taskData.clusterInfo.name}</div>
                            </div>
                            <div>
                                <div className="text-sm text-muted-foreground">Nodes Assigned</div>
                                <div>{taskData.clusterInfo.nodesAssigned} / {taskData.clusterInfo.totalNodes}</div>
                            </div>
                        </div>
                    </div>

                    {/* Resource Allocation */}
                    <div className="bg-sidebar/30 rounded-lg p-4 border border-sidebar-border/50">
                        <h3 className="text-sm text-muted-foreground mb-4">Resource Allocation</h3>
                        <div className="space-y-3">
                            {Object.entries(taskData.resources.allocated).map(([key, value]) => (
                                <div key={key}>
                                    <div className="text-sm text-muted-foreground capitalize">
                                        {key.replace(/([A-Z])/g, ' $1').trim()}
                                    </div>
                                    <div>{value}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Resource Consumption */}
                    <div className="bg-sidebar/30 rounded-lg p-4 border border-sidebar-border/50">
                        <h3 className="text-sm text-muted-foreground mb-4">Resource Consumption</h3>
                        <div className="space-y-3">
                            {Object.entries(taskData.resources.consumption).map(([key, value]) => (
                                <div key={key}>
                                    <div className="text-sm text-muted-foreground capitalize">
                                        {key.replace(/([A-Z])/g, ' $1').trim()}
                                    </div>
                                    <div>{value}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Rewards */}
                    <div className="bg-sidebar/30 rounded-lg p-4 border border-sidebar-border/50">
                        <h3 className="text-sm text-muted-foreground mb-4">Rewards</h3>
                        <div className="space-y-3">
                            <div>
                                <div className="text-sm text-muted-foreground">Total Reward</div>
                                <div className="text-xl font-medium">{taskData.results.rewards.total}</div>
                            </div>
                            <div className="pt-2 border-t border-sidebar-border/50">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <div className="text-sm text-muted-foreground">Base Reward</div>
                                        <div>{taskData.results.rewards.breakdown.base}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-muted-foreground">Bonus</div>
                                        <div>{taskData.results.rewards.breakdown.bonus}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}; 