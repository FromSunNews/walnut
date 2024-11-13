import React from "react"
import { Server, FileText, LayoutDashboard, Code } from "lucide-react"
import DeployCluster from "../dashboard/cloud-workspace/deploy-cluster"
import SubmitTask from "../dashboard/cloud-workspace/submit-task"
import UploadFile from "../dashboard/cloud-workspace/upload-file"
import RegisterWorker from "../dashboard/worker-workspace/register-worker"
import { Overview } from "../dashboard/worker-workspace/manage-cluster/overview"
import { NodeStatus } from "../dashboard/worker-workspace/manage-cluster/node-status"
import { TaskStatus } from "../dashboard/worker-workspace/manage-cluster/task-status"

/**
 * Menu configuration for Ray cluster management interface
 * Defines navigation structure for both cloud and worker workspaces
 * Based on Ray's distributed computing capabilities and dashboard features
 */
export const menuItems = {
  /**
   * Cloud workspace menu items
   * Focused on cluster deployment and task management
   * Features:
   * - Cluster deployment with configurable resources
   * - Task submission for distributed processing
   * - File management for data and model uploads
   */
  cloud: [
    {
      title: "Deploy Cluster",
      component: "deploy-cluster",
      path: "Deploy Cluster",
      componentData: <DeployCluster />,
      icon: Server,
      isActive: false,
    },
    {
      title: "Submit Task",
      component: "submit-task",
      path: "Submit Task",
      componentData: <SubmitTask />,
      icon: Code,
      isActive: true,
    },
    {
      title: "Upload",
      component: "upload-file",
      path: "Upload File",
      componentData: <UploadFile />,
      icon: FileText,
      isActive: true,
    }
  ],

  /**
   * Worker workspace menu items
   * Focused on node management and monitoring
   * Features based on Ray Dashboard capabilities:
   * - Worker registration and configuration
   * - Performance monitoring
   * - Resource utilization tracking
   * - Task execution status
   */
  worker: [
    {
      title: "Register Worker",
      component: "register-worker",
      path: "Register Worker",
      componentData: <RegisterWorker />,
      icon: Server,
      isActive: false,
    },
    {
      title: "Manage Cluster",
      path: "Manage Cluster",
      icon: LayoutDashboard,
      isActive: false,
      hasChildren: true,
      /**
       * Dashboard sub-menu items
       * Based on Ray Dashboard monitoring features:
       * - System overview and metrics
       * - Node status and health monitoring
       * - Task execution tracking
       */
      items: [
        {
          title: "Overview",
          component: "overview",
          path: "Dashboard/Overview",
          componentData: <Overview />
        },
        {
          title: "Node Status",
          component: "node-status",
          path: "Dashboard/Node Status",
          componentData: <NodeStatus />
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