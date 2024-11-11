import { Cloud, Server, Code, BarChart, Shield, Cpu, Activity, Wallet, FileCode, Settings, Rocket, PlusCircle, DollarSign } from "lucide-react";
import { QuickStartCard } from "./QuickStartCard";

/**
 * Welcome screen component displaying workspace features and quick start guide
 * Based on Ray's distributed computing capabilities
 */
export function WelcomeScreen({ workspace }) {
  const icons = {
    cloud: Cloud,
    worker: Server
  }
  const Icon = icons[workspace]

  const features = workspace === 'cloud' ? [
    { icon: Cloud, title: 'Cloud Computing', description: 'Access distributed computing power' },
    { icon: Code, title: 'Task Management', description: 'Deploy and monitor your tasks' },
    { icon: BarChart, title: 'Analytics', description: 'Track performance metrics' },
    { icon: Shield, title: 'Security', description: 'Enterprise-grade security measures' }
  ] : [
    { icon: Server, title: 'Node Management', description: 'Register and monitor your nodes' },
    { icon: Cpu, title: 'Resource Allocation', description: 'Optimize computing resources' },
    { icon: Activity, title: 'Performance', description: 'Monitor node performance' },
    { icon: Wallet, title: 'Rewards', description: 'Track your earnings' }
  ]

  return (
    <div className="flex flex-col items-center justify-center h-full py-10 animate-fade-in">
      {/* Hero Section */}
      <HeroSection Icon={Icon} workspace={workspace} />

      {/* Features Grid */}
      <FeaturesGrid features={features} />

      {/* Quick Start Section */}
      <QuickStartSection workspace={workspace} />
    </div>
  )
}

function HeroSection({ Icon, workspace }) {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-6 mb-12">
      <div className="flex items-center justify-center size-24 rounded-full bg-gradient-to-br from-sidebar-primary/20 to-sidebar-primary mb-6 p-1 ring-1 ring-sidebar-primary/20 animate-pulse-slow">
        <div className="flex items-center justify-center size-full rounded-full bg-sidebar/30 backdrop-blur-sm">
          <Icon className="size-12 text-sidebar-primary" />
        </div>
      </div>
      <div className="space-y-3">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-sidebar-primary to-purple-500 bg-clip-text text-transparent">
          Welcome to {workspace === 'cloud' ? 'Cloud Workspace' : 'Worker Workspace'}
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          {workspace === 'cloud'
            ? 'Experience the power of distributed computing. Deploy tasks, monitor performance, and scale your applications with ease.'
            : 'Join our distributed computing network. Contribute resources, earn rewards, and be part of the next generation of cloud computing.'}
        </p>
      </div>
    </div>
  )
}

function FeaturesGrid({ features }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
      {features.map((feature, index) => (
        <div
          key={index}
          className="group p-6 rounded-xl bg-sidebar/10 border border-sidebar-border/50 hover:border-sidebar-primary/20 hover:bg-sidebar/20 transition-all duration-300"
        >
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-3 rounded-lg bg-sidebar-primary/10 group-hover:bg-sidebar-primary/20 transition-colors">
              <feature.icon className="size-6 text-sidebar-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function QuickStartSection({ workspace }) {
  return (
    <div className="mt-12 w-full max-w-6xl">
      <div className="p-6 rounded-xl bg-sidebar/10 border border-sidebar-border/50">
        <h2 className="text-xl font-semibold mb-4">Quick Start Guide</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {workspace === 'cloud' ? (
            <>
              <QuickStartCard
                step={1}
                title="Create Task"
                description="Define your computational task"
                icon={FileCode}
              />
              <QuickStartCard
                step={2}
                title="Configure Resources"
                description="Set computing requirements"
                icon={Settings}
              />
              <QuickStartCard
                step={3}
                title="Deploy"
                description="Launch your task to the network"
                icon={Rocket}
              />
            </>
          ) : (
            <>
              <QuickStartCard
                step={1}
                title="Register Node"
                description="Connect your computing resources"
                icon={PlusCircle}
              />
              <QuickStartCard
                step={2}
                title="Configure Settings"
                description="Optimize your node settings"
                icon={Settings}
              />
              <QuickStartCard
                step={3}
                title="Start Earning"
                description="Begin processing tasks"
                icon={DollarSign}
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
} 