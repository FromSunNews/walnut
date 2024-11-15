import { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Activity, Shield, Globe } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import './styles.scss';

// Custom tooltip component
const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-black/80 border border-gray-700 rounded p-2 text-sm">
                <p className="text-white">{payload[0].value} SUI</p>
            </div>
        );
    }
    return null;
};

// Uptime Block Component
const UptimeBlock = ({ status }) => (
    <div className={`w-[14px] h-[24px] rounded ${status ? 'bg-green-500/20' : 'bg-red-500/20'}`} />
);

// Task Detail Dialog Component
const TaskDetailDialog = ({ task, isOpen, onClose }) => {
    if (!isOpen || !task) return null;

    return (
        <div className="fixed inset-0 z-50">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm task-detail-backdrop"
                onClick={onClose}
            />

            {/* Dialog Content */}
            <div className="fixed inset-y-0 right-0 w-[800px] bg-background/95 shadow-lg p-6 overflow-y-auto border-l border-sidebar-border/50 task-detail-content">
                {/* Header */}
                <div className="task-detail-header">
                    <button
                        onClick={onClose}
                        className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to jobs
                    </button>
                    <div className="mt-4">
                        <h2 className="text-xl font-semibold">{task.taskDetails.type}</h2>
                        <p className="text-sm text-muted-foreground">{task.taskDetails.description}</p>
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-6 mt-6">
                    {/* Task Info */}
                    <div className="task-detail-section">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-sidebar/30 rounded-lg p-4">
                                <div className="text-sm text-muted-foreground">Task ID</div>
                                <div className="font-mono">{task.id}</div>
                            </div>
                            <div className="bg-sidebar/30 rounded-lg p-4">
                                <div className="text-sm text-muted-foreground">Cluster</div>
                                <div>{task.clusterName}</div>
                            </div>
                        </div>
                    </div>

                    {/* Timing */}
                    <div className="task-detail-section">
                        <div className="bg-sidebar/30 rounded-lg p-4">
                            <h3 className="text-sm text-muted-foreground mb-4">Timing</h3>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <div className="text-sm text-muted-foreground">Start Time</div>
                                    <div>{new Date(task.timing.startTime).toLocaleString()}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground">Duration</div>
                                    <div>{task.timing.duration}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground">Expected</div>
                                    <div>{task.timing.expectedDuration}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Performance */}
                    <div className="task-detail-section">
                        <div className="bg-sidebar/30 rounded-lg p-4">
                            <h3 className="text-sm text-muted-foreground mb-4">Performance</h3>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <div className="text-sm text-muted-foreground">CPU Usage</div>
                                    <div>{task.performance.cpuUsage}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground">GPU Usage</div>
                                    <div>{task.performance.gpuUsage}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground">Efficiency</div>
                                    <div>{task.performance.efficiency}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Results & Rewards */}
                    <div className="task-detail-section">
                        <div className="bg-sidebar/30 rounded-lg p-4">
                            <h3 className="text-sm text-muted-foreground mb-4">Results & Rewards</h3>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <div className="text-sm text-muted-foreground">Data Processed</div>
                                    <div>{task.results.dataProcessed}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground">Status</div>
                                    <div>{task.results.status}</div>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-sidebar-border/50">
                                <div>
                                    <div className="text-sm text-muted-foreground">Base</div>
                                    <div>{task.rewards.base} SUI</div>
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground">Bonus</div>
                                    <div>{task.rewards.bonus} SUI</div>
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground">Total</div>
                                    <div className="font-medium">{task.rewards.total} SUI</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Job History Section Component
const JobHistorySection = ({ jobHistory }) => {
    const [selectedTask, setSelectedTask] = useState(null);

    return (
        <>
            <div className="bg-black/40 rounded-lg p-6 mt-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Job History</h3>
                    <div className="flex gap-2">
                        <select className="bg-sidebar/30 rounded px-2 py-1 text-sm border border-sidebar-border/50">
                            <option>All Status</option>
                            <option>Completed</option>
                            <option>In Progress</option>
                        </select>
                        <select className="bg-sidebar/30 rounded px-2 py-1 text-sm border border-sidebar-border/50">
                            <option>Last 24 hours</option>
                            <option>Last 7 days</option>
                            <option>Last 30 days</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="text-left text-sm text-gray-400">
                            <tr className="border-b border-gray-700">
                                <th className="pb-2">Job ID</th>
                                <th className="pb-2">Task Type</th>
                                <th className="pb-2">Duration</th>
                                <th className="pb-2">Resources</th>
                                <th className="pb-2">Efficiency</th>
                                <th className="pb-2">Status</th>
                                <th className="pb-2">Rewards</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {jobHistory.map((job) => (
                                <tr
                                    key={job.id}
                                    className="job-row border-b border-gray-800"
                                    onClick={() => setSelectedTask(job)}
                                >
                                    <td className="py-3 font-mono text-xs">{job.id}</td>
                                    <td className="py-3">{job.taskDetails.type}</td>
                                    <td className="py-3">{job.timing.duration}</td>
                                    <td className="py-3">
                                        <div className="flex gap-2">
                                            <span className="px-2 py-1 bg-sidebar/30 rounded text-xs">
                                                CPU: {job.performance.cpuUsage}
                                            </span>
                                            <span className="px-2 py-1 bg-sidebar/30 rounded text-xs">
                                                GPU: {job.performance.gpuUsage}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-3">{job.performance.efficiency}</td>
                                    <td className="py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs ${job.results.status === 'Completed'
                                            ? 'bg-green-500/20 text-green-400'
                                            : 'bg-orange-500/20 text-orange-400'
                                            }`}>
                                            {job.results.status}
                                        </span>
                                    </td>
                                    <td className="py-3">
                                        <div className="flex flex-col">
                                            <span>{job.rewards.total} SUI</span>
                                            <span className="text-xs text-gray-400">
                                                +{job.rewards.points} points
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <TaskDetailDialog
                task={selectedTask}
                isOpen={!!selectedTask}
                onClose={() => setSelectedTask(null)}
            />
        </>
    );
};

// Main Component
export const ManageWorker = () => {
    const [workerData, setWorkerData] = useState(() => {
        // Tạo dữ liệu cho chart với mỗi ngày một giá trị
        const dailyEarnings = [
            { date: '15/10', amount: 10 },
            { date: '17/10', amount: 180 },
            { date: '19/10', amount: 320 },
            { date: '21/10', amount: 260 },
            { date: '23/10', amount: 220 },
            { date: '25/10', amount: 200 },
            { date: '27/10', amount: 240 },
            { date: '29/10', amount: 380 },
            { date: '31/10', amount: 340 },
            { date: '2/11', amount: 300 },
            { date: '4/11', amount: 120 },
            { date: '6/11', amount: 200 },
            { date: '8/11', amount: 320 },
            { date: '10/11', amount: 220 },
            { date: '12/11', amount: 20 }
        ];

        return {
            name: 'io-worker-node',
            status: 'Idle',
            isVerified: true,
            specs: {
                gpu: 'RTX 3090',
                os: 'Windows',
                version: 'x32'
            },
            uptime: {
                days: 68,
                hours: 44,
                lastDays: {
                    range: '01/01 - 01/30',
                    percentage: '99.6%'
                },
                dailyStatus: Array(30).fill(true).map(() => Math.random() > 0.2)
            },
            stats: {
                totalBlockRewards: '625,324',
                totalPoints: '33,404',
                totalJobFees: '00.50',
                blockStats: {
                    earned: 5,
                    failed: 20,
                    missed: 12000
                }
            },
            dailyEarnings,
            performance: {
                uptimePercentage: 65,
                lastUpdated: new Date().toLocaleTimeString(),
                proofOfWork: {
                    score: '10,120',
                    status: 'Completed'
                },
                connectivity: {
                    tier: 'Medium',
                    download: '620.72 mb/s',
                    upload: '500.40 mb/s'
                }
            },
            // Job History Data
            jobHistory: [
                {
                    id: "JOB-20240321-001",
                    taskDetails: {
                        type: "AI Model Training",
                        description: "Training large language model",
                        priority: "High"
                    },
                    timing: {
                        startTime: "2024-03-21T08:00:00Z",
                        duration: "2h 30m",
                        expectedDuration: "2h"
                    },
                    performance: {
                        cpuUsage: "85%",
                        gpuUsage: "92%",
                        efficiency: "95%"
                    },
                    results: {
                        status: "Completed",
                        dataProcessed: "500GB"
                    },
                    rewards: {
                        base: "100",
                        bonus: "20",
                        total: "120",
                        points: "500"
                    }
                },
                {
                    id: "JOB-20240321-002",
                    taskDetails: {
                        type: "Data Processing",
                        description: "Processing large dataset for analysis",
                        priority: "Medium"
                    },
                    timing: {
                        startTime: "2024-03-21T10:00:00Z",
                        duration: "3h 15m",
                        expectedDuration: "3h"
                    },
                    performance: {
                        cpuUsage: "78%",
                        gpuUsage: "88%",
                        efficiency: "90%"
                    },
                    results: {
                        status: "In Progress",
                        dataProcessed: "300GB"
                    },
                    rewards: {
                        base: "90",
                        bonus: "15",
                        total: "105",
                        points: "300"
                    }
                }
            ]
        };
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setWorkerData(prev => ({
                ...prev,
                performance: {
                    ...prev.performance,
                    uptimePercentage: Math.floor(60 + Math.random() * 40),
                    lastUpdated: new Date().toLocaleTimeString()
                }
            }));
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Header */}
            <div className="border-b border-border/40 p-4">
                {/* <div className="flex items-center gap-4">
                    <button className="text-muted-foreground hover:text-foreground transition-colors">
                        <ArrowLeft className="h-4 w-4" />
                        Back to workers
                    </button>
                </div> */}

                <div className=" flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <h1 className="text-xl font-semibold">{workerData.name}</h1>
                        {workerData.isVerified && (
                            <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-sm">
                                Verified
                            </span>
                        )}
                        <span className="bg-orange-500/20 text-orange-400 px-2 py-1 rounded-full text-sm">
                            {workerData.status}
                        </span>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-4 py-2 rounded-md bg-sidebar-border/20 hover:bg-sidebar-border/30 transition-colors">
                            Pause
                        </button>
                        <button className="px-4 py-2 rounded-md bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors">
                            Delete
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="p-6 grid grid-cols-3 gap-6">
                {/* Left Column - Stats */}
                <div className="col-span-2 space-y-6">
                    {/* Uptime Section - Updated Design */}
                    <div className="bg-black/40 rounded-lg p-6">
                        <div className="flex justify-between items-center mb-3 text-xs text-gray-400">
                            <div>Running For: {workerData.uptime.days}Hrs {workerData.uptime.hours}Mins</div>
                            <div>Last 30 days ({workerData.uptime.lastDays.range}) {workerData.uptime.lastDays.percentage} Uptime</div>
                        </div>

                        {/* Uptime Blocks - Single Row */}
                        <div className="flex gap-[2px] items-center">
                            {workerData.uptime.dailyStatus.map((status, i) => (
                                <UptimeBlock key={i} status={status} />
                            ))}
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-4 mt-6">
                        <div className="bg-black/40 rounded-lg p-4">
                            <div className="text-xs uppercase tracking-wider text-gray-400 mb-1">TOTAL BLOCK REWARDS</div>
                            <div className="text-2xl font-medium">{workerData.stats.totalBlockRewards}</div>
                        </div>
                        <div className="bg-black/40 rounded-lg p-4">
                            <div className="text-xs uppercase tracking-wider text-gray-400 mb-1">TOTAL POINTS</div>
                            <div className="text-2xl font-medium">{workerData.stats.totalPoints}</div>
                        </div>
                        <div className="bg-black/40 rounded-lg p-4">
                            <div className="text-xs uppercase tracking-wider text-gray-400 mb-1">TOTAL JOB FEES</div>
                            <div className="text-2xl font-medium">{workerData.stats.totalJobFees}</div>
                        </div>
                    </div>

                    {/* Daily Earnings Chart */}
                    <div className="bg-black/40 rounded-lg p-6 mt-6">
                        <h3 className="text-sm text-gray-400 mb-4">Daily Block Reward Earnings</h3>

                        {/* Chart */}
                        <div className="h-[200px] w-full overflow-hidden">
                            <BarChart
                                width={800}
                                height={200}
                                data={workerData.dailyEarnings}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#6B7280', fontSize: 12 }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#6B7280', fontSize: 12 }}
                                    tickFormatter={(value) => `$${value}`}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar
                                    dataKey="amount"
                                    fill="#374151"
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        </div>

                        {/* Stats Row */}
                        <div className="flex justify-start gap-8 mt-4 text-sm text-gray-400">
                            <div className="flex items-center gap-2">
                                <span>Total Blocks Earned:</span>
                                <span className="text-white">{workerData.stats.blockStats.earned}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span>Total Blocks Failed:</span>
                                <span className="text-white">{workerData.stats.blockStats.failed}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span>Total Blocks Missed:</span>
                                <span className="text-white">{workerData.stats.blockStats.missed}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Performance Metrics */}
                <div className="space-y-6">
                    {/* System Specs */}
                    <div className="bg-sidebar/20 rounded-lg p-4 border border-sidebar-border/50">
                        <div className="flex gap-3">
                            <span className="px-2 py-1 bg-sidebar/30 rounded text-sm">
                                {workerData.specs.gpu}
                            </span>
                            <span className="px-2 py-1 bg-sidebar/30 rounded text-sm">
                                {workerData.specs.os} {workerData.specs.version}
                            </span>
                        </div>
                    </div>

                    {/* Performance Gauge */}
                    <div className="bg-sidebar/20 rounded-lg p-6 border border-sidebar-border/50">
                        <h3 className="text-lg font-medium mb-4">Uptime Percentage</h3>
                        <div className="relative w-40 h-40 mx-auto">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-3xl font-bold">{workerData.performance.uptimePercentage}%</span>
                            </div>
                        </div>
                    </div>

                    {/* Additional Metrics */}
                    <div className="space-y-4">
                        <div className="bg-sidebar/20 rounded-lg p-4 border border-sidebar-border/50">
                            <h4 className="text-sm text-muted-foreground mb-2">Proof Of Work Score</h4>
                            <div className="flex justify-between items-center">
                                <span>{workerData.performance.proofOfWork.score}</span>
                                <span className="text-green-400">{workerData.performance.proofOfWork.status}</span>
                            </div>
                        </div>

                        <div className="bg-sidebar/20 rounded-lg p-4 border border-sidebar-border/50">
                            <h4 className="text-sm text-muted-foreground mb-2">Connectivity Tier</h4>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Download</span>
                                    <span>{workerData.performance.connectivity.download}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Upload</span>
                                    <span>{workerData.performance.connectivity.upload}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add JobHistorySection */}
            <JobHistorySection jobHistory={workerData.jobHistory} />
        </div>
    );
};