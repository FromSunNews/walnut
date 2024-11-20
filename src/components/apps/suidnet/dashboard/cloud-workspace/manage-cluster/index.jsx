// import { useState, useEffect } from 'react';
// import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
// import { ArrowLeft, Clock, Activity, Shield, Globe } from 'lucide-react';

// export const ManageCluster = () => {
//   const [workerData, setWorkerData] = useState(() => {
//     // Tạo dữ liệu cho 30 ngày gần nhất
//     const today = new Date();
//     const last30Days = Array.from({ length: 30 }, (_, i) => {
//       const date = new Date();
//       date.setDate(today.getDate() - (29 - i));
//       return {
//         date: `${date.getDate()}/${date.getMonth() + 1}`,
//         amount: i === 28 ? Math.floor(Math.random() * 400) + 100 : 0,
//         isActive: Math.random() > 0.2
//       };
//     });

//     // Tính thời gian chạy
//     const startDate = new Date('2024-02-01'); // Giả sử ngày bắt đầu
//     const diffTime = Math.abs(today - startDate);
//     const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
//     const diffMins = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));

//     return {
//       name: 'io-worker-node',
//       status: 'Idle',
//       isVerified: true,

//       uptime: {
//         days: diffHours,
//         hours: diffMins,
//         lastDays: {
//           range: `${last30Days[0].date} - ${last30Days[last30Days.length - 1].date}`,
//           percentage: '99.6%'
//         },
//         dailyStatus: last30Days.map(day => day.isActive)
//       },

//       stats: {
//         totalBlockRewards: '625,324',
//         totalPoints: '33,404',
//         totalJobFees: '00.50'
//       },

//       blockStats: {
//         earned: 5,
//         failed: 20,
//         missed: 12000
//       },

//       // Sử dụng dữ liệu 30 ngày đã tạo
//       dailyEarnings: last30Days.map(day => ({
//         date: day.date,
//         amount: day.amount
//       })),

//       specs: {
//         gpu: 'RTX 3090',
//         os: 'Windows',
//         version: 'x32'
//       },

//       performance: {
//         uptimePercentage: 65,
//         lastUpdated: new Date().toLocaleTimeString(),
//         proofOfWork: {
//           score: '10,120',
//           status: 'Completed'
//         },
//         connectivity: {
//           tier: 'Medium',
//           download: '620.72 mb/s',
//           upload: '500.40 mb/s'
//         }
//       }
//     };
//   });

//   // Cập nhật thời gian real-time
//   useEffect(() => {
//     const interval = setInterval(() => {
//       const now = new Date();
//       setWorkerData(prev => ({
//         ...prev,
//         performance: {
//           ...prev.performance,
//           uptimePercentage: Math.floor(60 + Math.random() * 40),
//           lastUpdated: now.toLocaleTimeString()
//         }
//       }));
//     }, 5000);

//     return () => clearInterval(interval);
//   }, []);

//   const CustomTooltip = ({ active, payload }) => {
//     if (active && payload && payload.length) {
//       return (
//         <div className="bg-sidebar/80 border border-sidebar-border/50 rounded p-2 text-sm">
//           <p className="text-sidebar-foreground">${payload[0].value}</p>
//         </div>
//       );
//     }
//     return null;
//   };

//   return (
//     <div className="min-h-screen bg-background text-foreground">
//       {/* Header */}
//       <div className="border-b border-sidebar-border/50 p-4">
//         <div className="flex items-center gap-4">
//           <button className="text-muted-foreground hover:text-foreground transition-colors">
//             <ArrowLeft className="h-4 w-4" />
//             Back to workers
//           </button>
//         </div>

//         <div className="mt-4 flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <h1 className="text-xl font-semibold text-sidebar-foreground">{workerData.name}</h1>
//             {workerData.isVerified && (
//               <span className="bg-sidebar-primary/20 text-sidebar-primary px-2 py-1 rounded-full text-sm">
//                 Verified
//               </span>
//             )}
//             <span className="bg-orange-500/20 text-orange-400 px-2 py-1 rounded-full text-sm">
//               {workerData.status}
//             </span>
//           </div>
//           <div className="flex gap-3">
//             <button className="px-4 py-2 rounded-md bg-sidebar/30 hover:bg-sidebar/40 transition-colors text-sidebar-foreground">
//               Pause
//             </button>
//             <button className="px-4 py-2 rounded-md bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors">
//               Delete
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="p-6 grid grid-cols-3 gap-6">
//         {/* Left Column - Stats */}
//         <div className="col-span-2 space-y-6">
//           {/* Uptime Chart */}
//           <div className="bg-sidebar/30 rounded-lg p-6 border border-sidebar-border/50">
//             <div className="flex justify-between items-center mb-4">
//               <div>
//                 <div className="text-sm text-muted-foreground">Running For</div>
//                 <div className="text-sidebar-foreground">{`${workerData.uptime.days}Hrs ${workerData.uptime.hours}Mins`}</div>
//               </div>
//               <div className="text-right">
//                 <div className="text-sm text-muted-foreground">Last 30 days Uptime</div>
//                 <div className="text-sidebar-foreground">{workerData.uptime.lastDays.percentage}</div>
//               </div>
//             </div>
//             <div className="flex gap-[2px] items-center">
//               {workerData.uptime.dailyStatus.map((status, i) => (
//                 <div
//                   key={i}
//                   className={`aspect-square w-4 rounded-sm ${status ? 'bg-sidebar-primary/80' : 'bg-red-500/80'
//                     }`}
//                 />
//               ))}
//             </div>
//           </div>

//           {/* Stats Grid */}
//           <div className="grid grid-cols-3 gap-4">
//             {Object.entries(workerData.stats).slice(0, 3).map(([key, value]) => (
//               <div key={key} className="bg-sidebar/30 rounded-lg p-4 border border-sidebar-border/50">
//                 <div className="text-sm text-muted-foreground uppercase tracking-wider">
//                   {key.replace(/([A-Z])/g, ' $1').trim()}
//                 </div>
//                 <div className="text-2xl font-medium text-sidebar-foreground mt-1">{value}</div>
//               </div>
//             ))}
//           </div>

//           {/* Daily Earnings Chart */}
//           <div className="bg-sidebar/30 rounded-lg p-6 border border-sidebar-border/50">
//             <h3 className="text-sm text-muted-foreground mb-4">Daily Block Reward Earnings</h3>
//             <div className="w-full" style={{ height: '180px', minWidth: '300px' }}>
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart
//                   data={workerData.dailyEarnings}
//                   margin={{ top: 5, right: 20, left: 20, bottom: 30 }}
//                 >
//                   <XAxis
//                     dataKey="date"
//                     axisLine={false}
//                     tickLine={false}
//                     tick={{ fill: '#6B7280', fontSize: 11 }}
//                     interval={1}
//                     angle={-45}
//                     textAnchor="end"
//                     height={60}
//                   />
//                   <YAxis
//                     axisLine={false}
//                     tickLine={false}
//                     tick={{ fill: '#6B7280', fontSize: 11 }}
//                     tickFormatter={(value) => `$${value}`}
//                   />
//                   <Tooltip content={<CustomTooltip />} />
//                   <Bar
//                     dataKey="amount"
//                     fill="rgb(var(--sidebar-primary) / 0.3)"
//                     radius={[4, 4, 0, 0]}
//                   />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//             <div className="flex justify-start gap-8 mt-4 text-sm text-muted-foreground">
//               <div>Total Blocks Earned: <span className="text-sidebar-foreground">{workerData.blockStats.earned}</span></div>
//               <div>Failed: <span className="text-sidebar-foreground">{workerData.blockStats.failed}</span></div>
//               <div>Missed: <span className="text-sidebar-foreground">{workerData.blockStats.missed}</span></div>
//             </div>
//           </div>
//         </div>

//         {/* Right Column */}
//         <div className="space-y-4">
//           {/* System Specs */}
//           <div className="bg-sidebar/30 rounded-lg p-4 border border-sidebar-border/50">
//             <div className="flex gap-3">
//               <span className="px-2 py-1 bg-sidebar/40 rounded text-sm text-sidebar-foreground">
//                 {workerData.specs.gpu}
//               </span>
//               <span className="px-2 py-1 bg-sidebar/40 rounded text-sm text-sidebar-foreground">
//                 {workerData.specs.os}
//               </span>
//             </div>
//           </div>

//           {/* Performance Metrics */}
//           {/* ... rest of your existing components with updated styling ... */}
//         </div>
//       </div>
//     </div>
//   );
// };
