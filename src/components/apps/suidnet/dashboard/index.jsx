import React from "react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger
} from "./components/ui/sidebar";
import { AppSidebar } from "./components/side-bar/app-sidebar";
import { Separator } from "./components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "./components/ui/breadcrumb";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { menuItems } from "../utils/menuItems";

/**
 * Main Dashboard component for Ray cluster management
 * Provides interface for both cloud and worker node operations
 */
export const DashBoard = () => {
  const [activeWorkspace, setActiveWorkspace] = React.useState('cloud')
  const [activeComponent, setActiveComponent] = React.useState(null)
  const [activePath, setActivePath] = React.useState('')

  // Helper functions
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

  // Event handlers
  const handlePathClick = (pathIndex) => {
    const pathParts = activePath.split('/')
    const selectedPath = pathParts.slice(0, pathIndex + 1).join('/')
    const result = findComponentByPath(menuItems[activeWorkspace], selectedPath)
    if (result) {
      setActiveComponent(result.componentId)
      setActivePath(selectedPath)
    }
  }

  const handleWorkspaceChange = (workspace) => {
    setActiveWorkspace(workspace)
    setActiveComponent(null)
  }

  const handleComponentChange = (component) => {
    const result = findComponentAndPath(menuItems[activeWorkspace], component)
    setActiveComponent(component)
    setActivePath(result?.path || '')
  }

  // Render helpers
  const renderComponent = () => {
    if (!activeComponent) {
      return <WelcomeScreen workspace={activeWorkspace} />
    }
    const result = findComponentAndPath(menuItems[activeWorkspace], activeComponent)
    return result?.component || <WelcomeScreen workspace={activeWorkspace} />
  }

  return (
    <SidebarProvider className="flex-1">
      <div className="relative flex w-full">
        <AppSidebar
          onWorkspaceChange={handleWorkspaceChange}
          onComponentChange={handleComponentChange}
        />
        <SidebarInset className="flex h-full flex-col">
          <DashboardHeader
            activeWorkspace={activeWorkspace}
            activePath={activePath}
            onPathClick={handlePathClick}
            onReset={() => {
              setActiveComponent(null)
              setActivePath('')
            }}
          />
          <div className="h-full overflow-y-auto win11Scroll">
            <div className="flex flex-col gap-4 px-4 min-h-full">
              {renderComponent()}
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

const DashboardHeader = ({ activeWorkspace, activePath, onPathClick, onReset }) => {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                onClick={onReset}
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
                    onClick={() => onPathClick(index)}
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
  )
}
