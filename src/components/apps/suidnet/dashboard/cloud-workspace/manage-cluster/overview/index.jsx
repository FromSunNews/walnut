import React, { useState, useEffect } from 'react';
import { Copy, Search, Shield, Globe, ArrowLeft } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../../../../../../shared/dropdown-menu";
import { ChevronDown } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "../../../../../../shared/dialog";

const ProgressSquares = ({ value }) => {
    const totalSquares = 10;
    const filledSquares = Math.round(value / 10);

    return (
        <div className="flex gap-1">
            {[...Array(totalSquares)].map((_, index) => (
                <div
                    key={index}
                    className={`h-2.5 w-2.5 border transition-colors duration-200 
                        ${index < filledSquares
                            ? 'bg-white border-white-500'
                            : 'bg-sidebar/30 border-sidebar-border'}`}
                />
            ))}
        </div>
    );
};

// Worker Details View Component
const WorkerDetailsView = ({ worker, onBack }) => {
    return (
        <div className="min-h-screen">
            {/* Header */}
            <div className="flex items-center gap-4 p-4 border-b border-sidebar-border/50">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back</span>
                </button>
            </div>

            {/* Content */}
            <div className="p-6">
                <div className="space-y-6">
                    {/* Basic Info Section */}
                    <div>
                        <h1 className="text-2xl font-semibold mb-4">
                            {worker.role}: {worker.id}
                        </h1>
                        <div className="flex gap-4 items-center">
                            <span className="bg-green-900/30 text-green-500 px-3 py-1 rounded-md">
                                {worker.status === 'running' ? 'Running' : 'Stopped'}
                            </span>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                <span className="text-muted-foreground">Uptime: {worker.uptime}</span>
                            </div>
                        </div>
                    </div>

                    {/* System Requirements & Specs */}
                    <div className="grid grid-cols-2 gap-6">
                        {/* Minimum Requirements Card */}
                        <div className="bg-sidebar/20 rounded-lg p-6 border border-sidebar-border/50">
                            <h3 className="text-lg font-medium mb-4">Minimum Requirements</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">CPU:</span>
                                    <span>{worker.minRequirements.cpu}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Memory:</span>
                                    <span>{worker.minRequirements.memory}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Storage:</span>
                                    <span>{worker.minRequirements.storage}</span>
                                </div>
                            </div>
                        </div>

                        {/* Current Specs Card */}
                        <div className="bg-sidebar/20 rounded-lg p-6 border border-sidebar-border/50">
                            <h3 className="text-lg font-medium mb-4">Current Specifications</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Instance Type:</span>
                                    <span>{worker.instanceType}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Processor:</span>
                                    <span>{worker.processor}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Type:</span>
                                    <span>{worker.type}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Components & Ports */}
                    <div className="grid grid-cols-2 gap-6">
                        {/* Components Card */}
                        <div className="bg-sidebar/20 rounded-lg p-6 border border-sidebar-border/50">
                            <h3 className="text-lg font-medium mb-4">Components</h3>
                            <div className="space-y-2">
                                {worker.components.map((component, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                        <span>{component}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Ports Card */}
                        <div className="bg-sidebar/20 rounded-lg p-6 border border-sidebar-border/50">
                            <h3 className="text-lg font-medium mb-4">Required Ports</h3>
                            <div className="space-y-3">
                                {worker.ports.map((port, index) => (
                                    <div key={index} className="flex justify-between items-center">
                                        <span className="text-muted-foreground">{port.service}:</span>
                                        <span className="bg-sidebar/30 px-2 py-1 rounded">
                                            {port.port} {port.protocol}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Performance Metrics */}
                    <div className="bg-sidebar/20 rounded-lg p-6 border border-sidebar-border/50">
                        <h3 className="text-lg font-medium mb-4">Performance Metrics</h3>
                        <div className="grid grid-cols-2 gap-6">
                            {Object.entries(worker.performance).map(([key, value]) => (
                                <div key={key} className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground capitalize">{key}</span>
                                        <span>{value}%</span>
                                    </div>
                                    <ProgressSquares value={value} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ClusterManager = () => {
    const [isVisible, setIsVisible] = useState({
        header: false,
        controls: false,
        workers: false,
        sidebar: false
    });

    const [selectedState, setSelectedState] = useState('all');
    const [selectedWorker, setSelectedWorker] = useState(null);
    const [showWorkerDetails, setShowWorkerDetails] = useState(false);
    const [showDetails, setShowDetails] = useState(false);

    const workerStates = [
        { id: 'all', label: 'All Workers', color: 'bg-white' },
        { id: 'running', label: 'Running', color: 'bg-green-500' },
        { id: 'completed', label: 'Completed', color: 'bg-blue-500' },
        { id: 'failed', label: 'Failed', color: 'bg-red-500' },
        { id: 'destroyed', label: 'Destroyed', color: 'bg-gray-500' }
    ];

    // Get current selected state info
    const currentState = workerStates.find(state => state.id === selectedState);

    // Fake data for workers
    const workers = [
        {
            id: "head-node-01",
            name: "head-node",
            instanceType: "t3.2xlarge",
            type: "CPU",
            processor: "Intel Xeon",
            status: "running",
            uptime: "2 hrs 15 mins",
            role: "Head Node",
            performance: {
                cpu: 45,
                memory: 32,
                network: 75,
                storage: 60
            },
            components: [
                "kube-apiserver",
                "etcd",
                "kube-scheduler",
                "kube-controller-manager",
                "kubelet",
                "kube-proxy",
                "container-runtime"
            ],
            ports: [
                { port: 6443, protocol: "TCP", service: "Kubernetes API server" },
                { port: "2379-2380", protocol: "TCP", service: "etcd server client API" },
                { port: 10250, protocol: "TCP", service: "Kubelet API" },
                { port: 10259, protocol: "TCP", service: "kube-scheduler" },
                { port: 10257, protocol: "TCP", service: "kube-controller-manager" }
            ],
            minRequirements: {
                cpu: "2 cores",
                memory: "2GB",
                storage: "20GB"
            }
        },
        {
            id: "worker-node-01",
            name: "worker-node-01",
            instanceType: "p3.2xlarge",
            type: "GPU",
            processor: "NVIDIA V100",
            status: "running",
            uptime: "1 hr 30 mins",
            role: "Worker Node",
            performance: {
                cpu: 65,
                memory: 48,
                gpu: 85,
                storage: 45
            },
            components: [
                "kubelet",
                "kube-proxy",
                "container-runtime"
            ],
            ports: [
                { port: 10250, protocol: "TCP", service: "Kubelet API" },
                { port: "30000-32767", protocol: "TCP", service: "NodePort Services" }
            ],
            minRequirements: {
                cpu: "1 core",
                memory: "1GB",
                storage: "20GB"
            }
        },
        {
            id: "worker-node-02",
            name: "worker-node-02",
            instanceType: "p3.2xlarge",
            type: "GPU",
            processor: "NVIDIA V100",
            status: "running",
            uptime: "5 hrs 20 mins",
            role: "Worker Node",
            performance: {
                cpu: 78,
                memory: 64,
                gpu: 90,
                storage: 40
            },
            components: [
                "kubelet",
                "kube-proxy",
                "container-runtime"
            ],
            ports: [
                { port: 10250, protocol: "TCP", service: "Kubelet API" },
                { port: "30000-32767", protocol: "TCP", service: "NodePort Services" }
            ],
            minRequirements: {
                cpu: "1 core",
                memory: "1GB",
                storage: "20GB"
            }
        }
    ];

    // Cluster stats
    const clusterStats = {
        clusterId: "cluster-sui-01-xyz789",
        // AWS specific information
        aws: {
            region: "ap-southeast-1",
            vpc: "vpc-1234567",
            subnet: "subnet-abcdef",
            securityGroup: "sg-987654",
            iamRole: "RayClusterRole",
        },
        // Ray specific information
        ray: {
            version: "2.9.0",
            dashboard: "http://head-node:8265",
            objectStoreSize: "500GB",
            placementGroup: "ray-cluster-pg"
        },
        // Cluster metrics
        metrics: {
            totalNodes: 3,
            activeNodes: 3,
            totalGPUs: 1,
            totalCPUs: 48,
            totalMemory: "196GB",
            totalStorage: "2TB"
        },
        // Performance metrics
        performance: {
            runningTasks: 250,
            pendingTasks: 50,
            completedTasks: 1200,
            failedTasks: 5,
            objectStoreUsage: "45%",
            avgTaskLatency: "125ms",
            networkThroughput: "2.5 Gbps"
        },
        // Cost metrics
        costs: {
            currentHourly: "5.23 USD",
            projectedDaily: "125.52 USD",
            totalSpent: "450.75 USD",
            budget: "1000 USD"
        },
        // Auto-scaling configuration
        autoScaling: {
            enabled: true,
            minWorkers: 2,
            maxWorkers: 10,
            targetCPUUtilization: 70,
            targetMemoryUtilization: 80,
            cooldownPeriod: "300s"
        },
        // Network configuration
        network: {
            vpcCidr: "172.31.0.0/16",
            subnetCidr: "172.31.32.0/20",
            internetGateway: true,
            natGateway: true,
            privateSubnet: true
        },
        // Security
        security: {
            sslEnabled: true,
            kmsKeyId: "arn:aws:kms:region:account:key/xxx",
            iamAuthentication: true,
            securityPatches: "up-to-date"
        },
        // Monitoring
        monitoring: {
            cloudwatch: true,
            prometheus: true,
            logging: "CloudWatch Logs",
            alerting: {
                cpu: "80%",
                memory: "85%",
                disk: "75%"
            }
        }
    };

    useEffect(() => {
        // Trigger animations sequentially
        const timeouts = [
            setTimeout(() => setIsVisible(prev => ({ ...prev, header: true })), 100),
            setTimeout(() => setIsVisible(prev => ({ ...prev, controls: true })), 300),
            setTimeout(() => setIsVisible(prev => ({ ...prev, workers: true })), 500),
            setTimeout(() => setIsVisible(prev => ({ ...prev, sidebar: true })), 700),
        ];

        return () => timeouts.forEach(timeout => clearTimeout(timeout));
    }, []);

    if (showDetails && selectedWorker) {
        return <WorkerDetailsView
            worker={selectedWorker}
            onBack={() => {
                setShowDetails(false);
                setSelectedWorker(null);
            }}
        />;
    }

    return (
        <div className="min-h-screen">
            {/* Header */}
            <div className={`flex items-center justify-between p-4 border-b border-sidebar-border/50 
                           transition-all duration-300 transform
                           ${isVisible.header ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                        <span>Extend Cluster</span>
                    </button>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <span className="text-green-500">●</span>
                        <span>Running For: 0 Hrs 12 Mins</span>
                    </div>
                </div>
                {/* <div className="flex items-center gap-4">
                    {['Visual Studio', 'Jupyter Notebook', 'Ray Dashboard'].map((item) => (
                        <button
                            key={item}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            {item}
                        </button>
                    ))}
                </div> */}
            </div>

            <div className="flex">
                {/* Main Content */}
                <div className="flex-1 p-6">
                    {/* Controls */}
                    <div className={`flex items-center gap-4 mb-6 
                                    transition-all duration-300
                                    ${isVisible.controls ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
                        <DropdownMenu>
                            <DropdownMenuTrigger className="flex items-center gap-2 px-4 py-2 rounded-md 
                                                  bg-sidebar/30 hover:bg-sidebar/40 transition-all duration-300">
                                <div className="flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${currentState.color}`}></span>
                                    <span className="text-muted-foreground">{currentState.label}</span>
                                </div>
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-[200px]">
                                {workerStates.map((state) => (
                                    <DropdownMenuItem
                                        key={state.id}
                                        onClick={() => setSelectedState(state.id)}
                                        className={`flex items-center gap-2 cursor-pointer
                                          ${selectedState === state.id ? 'bg-accent' : ''}`}
                                    >
                                        <span className={`w-2 h-2 rounded-full ${state.color}`}></span>
                                        <span>{state.label}</span>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* New Controls */}
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-sidebar/30 rounded-md">
                                <span className="text-muted-foreground">4 Workers</span>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-sidebar/30 rounded-md">
                                <span className="text-muted-foreground">4 GPUs</span>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-sidebar/30 rounded-md">
                                <span className="text-muted-foreground">4 CPUs</span>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-sidebar/30 rounded-md">
                                <Search className="h-4 w-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Search"
                                    className="bg-transparent border-none focus:outline-none text-sm text-muted-foreground w-20"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Workers List */}
                    <div className="space-y-4">
                        {workers.map((worker, index) => (
                            <div
                                key={worker.id}
                                onClick={() => {
                                    setSelectedWorker(worker);
                                    setShowDetails(true);
                                }}
                                className={`group bg-sidebar/20 rounded-lg border border-transparent 
                                          hover:bg-sidebar/30 hover:border-sidebar-primary
                                          transition-all duration-300 cursor-pointer p-4
                                          ${isVisible.workers ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                                style={{
                                    transitionDelay: isVisible.workers ? `${index * 100}ms` : '0ms'
                                }}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex flex-col">
                                            <span className="text-foreground font-medium">{worker.name}</span>
                                            <span className="text-muted-foreground text-sm">{worker.processor}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-6">
                                        <div className="flex items-center space-x-2">
                                            <div className={`w-2 h-2 rounded-full ${worker.status === 'running' ? 'bg-green-500' : 'bg-red-500'
                                                }`} />
                                            <span className="text-muted-foreground">{worker.uptime}</span>
                                        </div>
                                        <div className="text-muted-foreground">{worker.location}</div>
                                    </div>
                                </div>

                                {/* Performance Metrics */}
                                <div className="mt-4 grid grid-cols-4 gap-4">
                                    {Object.entries(worker.performance).map(([key, value]) => (
                                        <div key={key} className="space-y-1">
                                            <div className="flex justify-between items-center">
                                                <div className="flex gap-2 text-xs text-muted-foreground">
                                                    <span className="capitalize">{key}</span>
                                                    <span>
                                                        {(() => {
                                                            switch (key) {
                                                                case 'cpu':
                                                                    return `${value}%`;
                                                                case 'memory':
                                                                    return `${value}GB`;
                                                                case 'storage':
                                                                    return `${value}GB`;
                                                                case 'network':
                                                                    return `${value}Mbps`;
                                                                default:
                                                                    return value;
                                                            }
                                                        })()}
                                                    </span>
                                                </div>
                                            </div>
                                            <ProgressSquares value={value} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Worker Details Modal */}
                    <Dialog open={showWorkerDetails} onOpenChange={setShowWorkerDetails}>
                        <DialogContent className="sm:max-w-[600px] bg-sidebar border border-sidebar-border">
                            <DialogHeader>
                                <DialogTitle className="text-lg font-semibold">
                                    Worker Details
                                </DialogTitle>
                            </DialogHeader>

                            {selectedWorker && (
                                <div className="space-y-6 py-4">
                                    {/* Basic Info */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground mb-2">Basic Information</h3>
                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Name:</span>
                                                    <span>{selectedWorker.name}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Instance Type:</span>
                                                    <span>{selectedWorker.instanceType}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Type:</span>
                                                    <span>{selectedWorker.type}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Processor:</span>
                                                    <span>{selectedWorker.processor}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground mb-2">Location</h3>
                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Region:</span>
                                                    <span>{selectedWorker.region}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">AZ:</span>
                                                    <span>{selectedWorker.availabilityZone}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Role:</span>
                                                    <span>{selectedWorker.role}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Uptime:</span>
                                                    <span>{selectedWorker.uptime}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Performance Metrics */}
                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground mb-4">Performance Metrics</h3>
                                        <div className="grid grid-cols-2 gap-6">
                                            {Object.entries(selectedWorker.performance).map(([key, value]) => (
                                                <div key={key} className="space-y-2">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-muted-foreground capitalize">{key}</span>
                                                        <span>{value}%</span>
                                                    </div>
                                                    <ProgressSquares value={value} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Right Sidebar */}
                <div className={`w-80 border-l border-sidebar-border/50 p-6
                                transition-all duration-300 transform
                                ${isVisible.sidebar ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
                    <div className="space-y-6">
                        {/* Cluster ID */}
                        <div className="space-y-2">
                            <h3 className="text-foreground text-sm font-medium">Cluster ID</h3>
                            <div className="flex items-center justify-between bg-sidebar/10 p-3 rounded border border-sidebar-border/50">
                                <span className="text-muted-foreground text-sm">{clusterStats.clusterId}</span>
                                <Copy className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground" />
                            </div>
                        </div>

                        <hr className="border-sidebar-border/50" />

                        {/* Compute Hours Section */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <h3 className="text-foreground text-sm font-medium">Compute Hours</h3>
                                <span className="text-green-500 text-xs flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                    Running
                                </span>
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between text-xs">
                                    <div>
                                        <span className="text-gray-400">Served:</span>
                                        <span className="text-white ml-1">12 mins (20%)</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400">Remaining:</span>
                                        <span className="text-white ml-1">48 mins (80%)</span>
                                    </div>
                                </div>
                                <div className="h-1 bg-sidebar/10 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-purple-500 to-purple-700"
                                        style={{ width: '20%' }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        <hr className="border-sidebar-border/50" />

                        {/* Connectivity Tier Section */}
                        <div className="space-y-2">
                            <h3 className="text-foreground text-sm font-medium">Connectivity Tier</h3>
                            <div className="bg-sidebar/10 p-3 rounded border border-sidebar-border/50">
                                <div className="flex items-center gap-2 mb-3">
                                    <Globe className="h-4 w-4 text-yellow-500" />
                                    <span className="text-gray-400 text-sm">Low Speed (Tier 1)</span>
                                </div>
                                <div className="flex justify-between">
                                    <div>
                                        <div className="text-white flex items-center gap-1">
                                            100 Mbps
                                            <span className="text-xs text-gray-400">(max: 150 Mbps)</span>
                                        </div>
                                        <div className="text-green-500 text-xs">Download</div>
                                        <div className="mt-1 h-1 w-24 bg-sidebar/30 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-green-500"
                                                style={{ width: '66%' }}
                                            ></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-white flex items-center gap-1">
                                            10 Mbps
                                            <span className="text-xs text-gray-400">(max: 50 Mbps)</span>
                                        </div>
                                        <div className="text-yellow-500 text-xs">Upload</div>
                                        <div className="mt-1 h-1 w-24 bg-sidebar/30 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-yellow-500"
                                                style={{ width: '20%' }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <hr className="border-sidebar-border/50" />

                        {/* Security Compliance Section */}
                        <div className="space-y-2">
                            <h3 className="text-foreground text-sm font-medium">Security Compliance</h3>
                            <div className="bg-sidebar/10 p-2 rounded border border-sidebar-border/50">
                                <div className="flex items-center gap-2 mb-3">
                                    <Shield className="h-4 w-4 text-gray-400" />
                                    <span className="text-gray-400 text-sm">End-to-End Encrypted</span>
                                </div>
                            </div>
                        </div>

                        <hr className="border-sidebar-border/50" />

                        {/* Locations Section */}
                        <div className="space-y-2">
                            <h3 className="text-foreground text-sm font-medium">Locations</h3>
                            <div className="grid grid-cols-2 gap-2">
                                {['Hong Kong', 'Japan', 'South Korea', 'Vietnam'].map((location) => (
                                    <div key={location} className="bg-sidebar/10 p-2 rounded border border-sidebar-border/50">
                                        <div className="w-4 h-4 rounded-full bg-gray-600"></div>
                                        <span className="text-gray-400 text-sm">{location}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <hr className="border-sidebar-border/50" />

                        {/* Terminate Button */}
                        <button className="w-full bg-red-950/50 text-red-500 py-2 rounded hover:bg-red-900/50 transition-colors">
                            Terminate Cluster
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Add named export for Overview (which is the same as ClusterManager)
export const Overview = ClusterManager;

// Keep the default export
export default ClusterManager; 