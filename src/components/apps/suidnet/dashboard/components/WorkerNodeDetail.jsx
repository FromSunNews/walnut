import React from 'react';
import { ArrowLeft, Copy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WorkerNodeDetail = ({ workerId }) => {
    const navigate = useNavigate();

    // Giả lập dữ liệu worker node
    const workerData = {
        id: "6f06ad6f-8952-447f-a91f-d56e123e0e0d",
        status: {
            state: "Running",
            isVerified: true,
            isReady: true
        },
        hardware: {
            gpu: "GeForce RTX 4090 D",
            gpuCount: "x8",
            os: "Linux"
        },
        uptime: {
            duration: "9 days 17:20:30",
            percentage: 100,
            lastPeriod: "Last 30 days (Sep 03 - Oct 02)"
        },
        blockRewards: {
            total: 1709,
            completed: 1704,
            failed: 5,
            pow: {
                count: 1723,
                label: "BR POW (zkTFLOPs Proof)"
            },
            timeLock: {
                count: 744,
                label: "BR Proof of TimeLock"
            }
        },
        jobs: {
            active: 6
        }
    };

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <div className="p-4 border-b border-sidebar-border/50">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                </button>

                <div className="mt-4">
                    <h1 className="text-2xl font-light mb-4">
                        Device ID: {workerData.id}
                    </h1>

                    <div className="flex items-center gap-4">
                        <div className="bg-green-900/30 text-green-500 px-3 py-1 rounded">
                            Cluster Ready
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <span className="text-green-500">●</span>
                                <span>Running</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-blue-500">✓</span>
                                <span>Verified</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-6 p-6">
                {/* Left Column */}
                <div className="col-span-2 space-y-6">
                    {/* Block Rewards Section */}
                    <div className="bg-sidebar/20 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg">BLOCK REWARDS NOMINATION ELIGIBILITY STATUS</h2>
                            <button className="text-gray-400">
                                <span>▼</span>
                            </button>
                        </div>
                        <div className="bg-green-900/30 text-green-500 px-3 py-1 rounded w-fit">
                            Eligible
                        </div>
                    </div>

                    {/* Uptime Chart */}
                    <div className="bg-sidebar/20 rounded-lg p-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <span className="text-gray-400">Running For: </span>
                                <span>{workerData.uptime.duration}</span>
                            </div>
                            <div>
                                <span className="text-gray-400">{workerData.uptime.lastPeriod}: </span>
                                <span>{workerData.uptime.percentage}% Uptime</span>
                            </div>
                        </div>
                        <div className="flex gap-1 mt-4">
                            {Array(30).fill(0).map((_, i) => (
                                <div
                                    key={i}
                                    className={`h-6 w-6 ${i === 7 ? 'bg-red-500' : 'bg-green-500'} rounded-sm`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Block Rewards Table */}
                    <div className="bg-sidebar/20 rounded-lg p-4">
                        <div className="flex gap-4 mb-4">
                            <button className="bg-sidebar/30 px-4 py-2 rounded-md flex items-center gap-2">
                                Block Rewards (BR)
                                <span className="bg-sidebar/30 px-2 py-0.5 rounded">
                                    {workerData.blockRewards.total}
                                </span>
                            </button>
                            <button className="bg-sidebar/30 px-4 py-2 rounded-md flex items-center gap-2">
                                {workerData.blockRewards.pow.label}
                                <span className="bg-sidebar/30 px-2 py-0.5 rounded">
                                    {workerData.blockRewards.pow.count}
                                </span>
                            </button>
                            <button className="bg-sidebar/30 px-4 py-2 rounded-md flex items-center gap-2">
                                {workerData.blockRewards.timeLock.label}
                                <span className="bg-sidebar/30 px-2 py-0.5 rounded">
                                    {workerData.blockRewards.timeLock.count}
                                </span>
                            </button>
                            <button className="bg-sidebar/30 px-4 py-2 rounded-md flex items-center gap-2">
                                Jobs
                                <span className="bg-sidebar/30 px-2 py-0.5 rounded">
                                    {workerData.jobs.active}
                                </span>
                            </button>
                        </div>

                        <div className="flex gap-2 mb-4">
                            <input
                                type="text"
                                placeholder="Search by Block ID"
                                className="flex-1 bg-sidebar/30 px-4 py-2 rounded-md border border-white/10 focus:border-white/20"
                            />
                            <button className="bg-white text-black px-4 py-2 rounded-md">
                                Show All {workerData.blockRewards.total}
                            </button>
                            <div className="flex items-center gap-2">
                                <span className="text-green-500">●</span>
                                <span>Completed {workerData.blockRewards.completed}</span>
                                <span className="text-red-500">●</span>
                                <span>Failed {workerData.blockRewards.failed}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    <div className="bg-sidebar/20 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-4">
                            <img src="/nvidia-icon.png" alt="NVIDIA" className="w-6 h-6" />
                            <span>{workerData.hardware.gpu}</span>
                            <span className="text-gray-400">{workerData.hardware.gpuCount}</span>
                            <img src="/linux-icon.png" alt="Linux" className="w-6 h-6" />
                            <span>{workerData.hardware.os}</span>
                        </div>
                    </div>

                    {/* Uptime Percentage Circle */}
                    <div className="bg-sidebar/20 rounded-lg p-4">
                        <h3 className="mb-4">Uptime Percentage</h3>
                        <div className="relative w-48 h-48 mx-auto">
                            {/* This is a placeholder for the circular progress indicator */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-4xl">{workerData.uptime.percentage}%</span>
                            </div>
                        </div>
                    </div>

                    {/* Device ID Copy Section */}
                    <div className="bg-sidebar/20 rounded-lg p-4">
                        <div className="text-gray-400 mb-2">Device ID</div>
                        <div className="flex items-center justify-between bg-sidebar/30 p-2 rounded">
                            <span className="text-sm truncate">{workerData.id}</span>
                            <Copy className="w-4 h-4 cursor-pointer hover:text-white transition-colors" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkerNodeDetail; 