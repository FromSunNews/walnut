import React from "react"
import { Cloud, Server, FileText, PlusCircle, LayoutDashboard } from "lucide-react"
import TaskStatus from "../TaskStatus"
import WalnetWorker from "../WalnetWorker"
import WalnetCloud from "../WalnetCloud"
// import WalnetWorker from "../walletworker"

export const menuItems = {
  cloud: [
    {
      title: "Deploy Cluster",
      component: "deploy-cluster",
      path: "Deploy Cluster",
      componentData: <WalnetCloud />,
      icon: Server,
      isActive: false,
    },
    {
      title: "Submit Task",
      component: "submit-task",
      path: "Submit Task",
      componentData: <div>Submit Task</div>,
      icon: FileText,
      isActive: true,
    }
  ],
  worker: [
    {
      title: "Register Worker",
      component: "register-worker",
      path: "Register Worker",
      componentData: <WalnetWorker />,
      icon: Server,
      isActive: false,
    },
    {
      title: "Dashboard",
      path: "Dashboard",
      icon: LayoutDashboard,
      isActive: false,
      hasChildren: true,
      items: [
        {
          title: "Overview",
          component: "overview",
          path: "Dashboard/Overview",
          componentData: <div>Overview</div>
        },
        {
          title: "Node Status",
          component: "node-status",
          path: "Dashboard/Node Status",
          componentData: <div>Node Status</div>
        },
        {
          title: "Task Status",
          component: "task-status",
          path: "Dashboard/Task Status",
          componentData: <TaskStatus />
        }
      ]
    }
  ]
} 