import * as React from "react"
import { ChevronsUpDown, Cloud, Server } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../ui/sidebar"

const workspaces = [
  {
    name: "Cloud Workspace",
    icon: Cloud,
    key: "cloud",
    description: "Manage and deploy tasks"
  },
  {
    name: "Worker Workspace",
    icon: Server,
    key: "worker",
    description: "Register and manage nodes"
  }
]

export function TeamSwitcher({ onWorkspaceChange }) {
  const { isMobile } = useSidebar()
  const [activeWorkspace, setActiveWorkspace] = React.useState(workspaces[0])

  const handleWorkspaceChange = (workspace) => {
    setActiveWorkspace(workspace)
    onWorkspaceChange(workspace.key)
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              {/* <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"> */}
              {/* <activeWorkspace.icon className="size-4" /> */}
              <img src="/walnet_icon.png" alt={activeWorkspace.name} className="size-8" />
              {/* </div> */}
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeWorkspace.name}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {activeWorkspace.description}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-sidebar"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            {workspaces.map((workspace) => (
              <DropdownMenuItem
                key={workspace.key}
                onClick={() => handleWorkspaceChange(workspace)}
                className="flex items-center gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-md bg-sidebar-primary">
                  <workspace.icon className="size-4" />
                </div>
                <div className="grid gap-0.5">
                  <span className="font-medium">{workspace.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {workspace.description}
                  </span>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
