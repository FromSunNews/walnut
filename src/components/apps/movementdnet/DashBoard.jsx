import React from "react";
import { Cloud, Server, PlusCircle, DollarSign, Code, BarChart, Shield, Cpu, Activity, Wallet, FileCode, Settings, Rocket } from "lucide-react"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger
} from "../../../components/ui/sidebar";
import { AppSidebar } from "../../../components/shared/side-bar/app-sidebar";
import { Separator } from "../../../components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "../../../components/ui/breadcrumb";
import { menuItems } from './utils/menuItems'

const WelcomeScreen = ({ workspace }) => {
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
    <div className="flex flex-col items-center justify-center min-h-full p-8 animate-fade-in">
      {/* Hero Section */}
      <div className="text-center space-y-6 mb-12">
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

      {/* Features Grid */}
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

      {/* Quick Start Section */}
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
    </div>
  )
}

const QuickStartCard = ({ step, title, description, icon: Icon }) => (
  <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-sidebar/20 transition-colors">
    <div className="flex-shrink-0 size-8 rounded-full bg-sidebar-primary/20 flex items-center justify-center text-sm font-medium text-sidebar-primary">
      {step}
    </div>
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <Icon className="size-4 text-sidebar-primary" />
        <h3 className="font-medium">{title}</h3>
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  </div>
)

export function DashBoard() {
  const [activeWorkspace, setActiveWorkspace] = React.useState('cloud')
  const [activeComponent, setActiveComponent] = React.useState(null)
  const [activePath, setActivePath] = React.useState('')

  const findComponentAndPath = (items, componentId) => {
    for (let item of items) {
      if (!item.hasChildren && item.component === componentId) {
        return { component: item.componentData, path: item.path }
      }
      if (item.hasChildren) {
        const found = item.items.find(subItem => subItem.component === componentId)
        if (found) return { component: found.componentData, path: found.path }
      }
    }
    return null
  }

  const handlePathClick = (pathIndex) => {
    const pathParts = activePath.split('/')
    const selectedPath = pathParts.slice(0, pathIndex + 1).join('/')

    const findComponentByPath = (items) => {
      for (let item of items) {
        if (!item.hasChildren && item.path === selectedPath) {
          return { component: item.componentData, componentId: item.component }
        }
        if (item.hasChildren) {
          const found = item.items.find(subItem => subItem.path === selectedPath)
          if (found) return { component: found.componentData, componentId: found.component }
        }
      }
      return null
    }

    const result = findComponentByPath(menuItems[activeWorkspace])
    if (result) {
      setActiveComponent(result.componentId)
      setActivePath(selectedPath)
    }
  }

  const renderComponent = () => {
    if (!activeComponent) {
      return <WelcomeScreen workspace={activeWorkspace} />
    }

    const result = findComponentAndPath(menuItems[activeWorkspace], activeComponent)
    return result?.component || <WelcomeScreen workspace={activeWorkspace} />
  }

  const handleWorkspaceChange = (workspace) => {
    setActiveWorkspace(workspace)
    setActiveComponent(null) // Reset component when workspace changes
  }

  const handleComponentChange = (component) => {
    const result = findComponentAndPath(menuItems[activeWorkspace], component)
    setActiveComponent(component)
    setActivePath(result?.path || '')
  }

  return (
    <SidebarProvider className="flex-1">
      <div className="relative flex w-full">
        <AppSidebar
          onWorkspaceChange={handleWorkspaceChange}
          onComponentChange={handleComponentChange}
        />
        <SidebarInset className="flex h-full flex-col">
          <header className="flex h-16 shrink-0 items-center gap-2">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      onClick={() => {
                        setActiveComponent(null)
                        setActivePath('')
                      }}
                      className="cursor-pointer"
                    >
                      {activeWorkspace.charAt(0).toUpperCase() + activeWorkspace.slice(1)} Workspace
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {activePath && activePath.split('/').map((item, index) => (
                    <React.Fragment key={index}>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbLink
                          onClick={() => handlePathClick(index)}
                          className="cursor-pointer"
                        >
                          {item}
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                    </React.Fragment>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <div className="h-full overflow-y-auto win11Scroll">
            <div className="flex flex-col gap-4 p-4 pt-0 h-full">
              {renderComponent()}
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}