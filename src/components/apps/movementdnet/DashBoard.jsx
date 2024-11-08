import React from "react";
import { Cloud, Server } from "lucide-react"
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

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="flex items-center justify-center size-20 rounded-full bg-sidebar-primary mb-4">
        <Icon className="size-10" />
      </div>
      <h1 className="text-2xl font-bold mb-2">
        Welcome to {workspace === 'cloud' ? 'Cloud Workspace' : 'Worker Workspace'}
      </h1>
      <p className="text-muted-foreground text-center max-w-md">
        {workspace === 'cloud'
          ? 'Manage and deploy your tasks efficiently in the cloud environment'
          : 'Register and manage your nodes in the worker network'}
      </p>
    </div>
  )
}

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