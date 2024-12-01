import React from "react"
import { Cloud, Server } from "lucide-react"

import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"
import { TeamSwitcher } from "./team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "../ui/sidebar"
import { menuItems } from "../../../utils/menuItems"


const data = {
  navMain: [
    {
      title: "Walnut Cloud",
      url: "#",
      icon: Cloud,
      items: [
        {
          title: "Submit Task",
          component: "submit-task",
          componentData: <div>Submit Task</div>,
        },
        {
          title: "Deploy Cluster",
          component: "deploy-cluster",
          componentData: <div>Deploy Cluster</div>,
        }
      ],
    },
    {
      title: "Walnut Worker",
      url: "#",
      icon: Server,
      items: [
        {
          title: "Register Node",
          component: "register-node",
          componentData: <div>Register Node</div>,
        },
        {
          title: "Dashboard",
          component: "dashboard",
          componentData: <div>Dashboard</div>,
        }
      ],
    }
  ],
  user: {
    name: "Walnut",
    email: "m@example.com",
    avatar: "img/icon/walrus.png"
  }
}

export function AppSidebar({ onWorkspaceChange, onComponentChange, ...props }) {
  const [activeWorkspace, setActiveWorkspace] = React.useState('cloud')

  const handleWorkspaceChange = (workspace) => {
    setActiveWorkspace(workspace)
    onWorkspaceChange(workspace)
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher onWorkspaceChange={handleWorkspaceChange} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          items={menuItems[activeWorkspace]}
          onComponentChange={onComponentChange}
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
