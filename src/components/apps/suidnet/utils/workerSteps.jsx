import { Cpu } from "lucide-react";
import {
  FaDesktop,
  FaMobileAlt,
  FaApple,
  FaWindows,
  FaLinux,
  FaAndroid,
  FaUserPlus,
  FaServer,
  FaCog,
  FaCheckCircle
} from "react-icons/fa";
import { BsGpuCard } from "react-icons/bs";

/**
 * Custom SVG icon components for the worker registration flow
 * Used to provide consistent visual styling across the application
 */
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M15.9998 7C15.9998 9.20914 14.2089 11 11.9998 11C9.79067 11 7.99981 9.20914 7.99981 7C7.99981 4.79086 9.79067 3 11.9998 3C14.2089 3 15.9998 4.79086 15.9998 7Z" stroke="currentColor" strokeWidth="1.6" />
    <path d="M11.9998 14C9.15153 14 6.65091 15.3024 5.23341 17.2638C4.48341 18.3016 4.10841 18.8204 4.6654 19.9102C5.2224 21 6.1482 21 7.99981 21H15.9998C17.8514 21 18.7772 21 19.3342 19.9102C19.8912 18.8204 19.5162 18.3016 18.7662 17.2638C17.3487 15.3024 14.8481 14 11.9998 14Z" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);

const AuthIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M8 5.99985H7C5.11438 5.99985 4.17157 5.99985 3.58579 6.58564C3 7.17142 3 8.11423 3 9.99985V16.9998C3 18.8855 3 19.8283 3.58579 20.4141C4.17157 20.9998 5.11438 20.9998 7 20.9998H17C18.8856 20.9998 19.8284 20.9998 20.4142 20.4141C21 19.8283 21 18.8855 21 16.9998V9.99985C21 8.11423 21 7.17142 20.4142 6.58564C19.8284 5.99985 18.8856 5.99985 17 5.99985H16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * Step definitions for the worker node registration process
 * Based on Ray's worker node configuration requirements
 * @type {Array<{id: number, title: string, description: string, icon: Component}>}
 */
export const STEPS = [
  {
    id: 1,
    title: "Connect New Worker",
    description: "Connect running walnet services, you can install more service packages to have more earnings and hiring rate.",
    icon: UserIcon
  },
  {
    id: 2,
    title: "Name Your Device",
    description: "Give your device a unique name to identify it in your network.",
    icon: FaUserPlus
  },
  {
    id: 3,
    title: "Select Operating System",
    description: "Choose the operating system your device is running.",
    icon: FaServer
  },
  {
    id: 4,
    title: "Select Device Type",
    description: "Specify whether your device is a desktop or mobile device.",
    icon: FaDesktop
  },
  {
    id: 5,
    title: "Script Installation",
    description: "Run this script on your device to set up the worker.",
    icon: FaCog
  },
  {
    id: 6,
    title: "Authorize Device",
    description: "Authorize your device to connect it to the network.",
    icon: AuthIcon
  },
  {
    id: 7,
    title: "Complete Setup",
    description: "Your device is now set up and ready to use.",
    icon: FaCheckCircle
  }
];

/**
 * Supported operating systems configuration for Ray worker nodes
 * Includes system requirements based on Ray's documentation
 * @type {Array<{name: string, icon: JSX.Element, description: string, requirements: Object}>}
 */
export const OPERATING_SYSTEMS = [
  {
    name: "Windows",
    icon: <FaWindows className="w-5 h-5" />,
    description: "Windows 7 and above",
    requirements: {
      cpu: "2 cores minimum",
      ram: "4GB minimum",
      storage: "10GB free space"
    }
  },
  {
    name: "macOS",
    icon: <FaApple className="w-5 h-5" />,
    description: "macOS 10.15 and above",
    requirements: {
      cpu: "2 cores minimum",
      ram: "4GB minimum",
      storage: "10GB free space"
    }
  },
  {
    name: "Linux",
    icon: <FaLinux className="w-5 h-5" />,
    description: "Ubuntu, Debian, CentOS",
    requirements: {
      cpu: "2 cores minimum",
      ram: "4GB minimum",
      storage: "10GB free space"
    }
  },
  {
    name: "Android",
    icon: <FaAndroid className="w-5 h-5" />,
    description: "Android 8.0 and above",
    requirements: {
      cpu: "1.5GHz minimum",
      ram: "3GB minimum",
      storage: "5GB free space"
    }
  },
  {
    name: "iOS",
    icon: <FaApple className="w-5 h-5" />,
    description: "iOS 13.0 and above",
    requirements: {
      cpu: "1.5GHz minimum",
      ram: "3GB minimum",
      storage: "5GB free space"
    }
  }
];

/**
 * Device types supported for Ray cluster nodes
 * CPU nodes for general computing and GPU nodes for AI/ML workloads
 * @type {Array<{name: string, icon: JSX.Element, description: string, requirements: Object}>}
 */
export const DEVICE_TYPES = [
  {
    name: "CPU",
    icon: <Cpu className="w-5 h-5" />,
    description: "Handle general tasks",
    requirements: {
      cpu: "2 cores minimum",
      ram: "4GB minimum",
      storage: "10GB free space"
    }
  },
  {
    name: "GPU",
    icon: <BsGpuCard className="w-5 h-5" />,
    description: "Handle AI tasks",
    requirements: {
      cpu: "1.5GHz minimum",
      ram: "3GB minimum",
      storage: "5GB free space"
    }
  }
];

/**
 * Validation rules for worker node registration form
 * Ensures data integrity and proper node configuration
 * @type {Object}
 */
export const VALIDATION_RULES = {
  deviceName: {
    minLength: 3,
    maxLength: 50,
    pattern: /^[a-zA-Z0-9-_]+$/,
    message: "Device name can only contain letters, numbers, hyphens and underscores"
  },
  required: {
    message: "This field is required"
  }
};

/**
 * Error messages for various scenarios during worker registration
 * Provides user-friendly feedback for error handling
 * @type {Object}
 */
export const ERROR_MESSAGES = {
  walletNotConnected: "Please connect your wallet first!",
  authorizationFailed: "Failed to authorize device. Please try again.",
  invalidDeviceName: "Invalid device name format",
  scriptError: "Error executing installation script",
  networkError: "Network connection error",
  osRequired: "Please select an operating system",
  deviceTypeRequired: "Please select a device type",
  deviceNameRequired: "Please enter a device name",
  deviceNameInvalid: "Invalid device name format",
  deviceNameTooShort: "Device name must be at least 3 characters",
  deviceNameTooLong: "Device name must be less than 50 characters",
  installationFailed: "Installation failed. Please try again.",
  authorizationTimeout: "Authorization timed out. Please try again."
};

/**
 * Installation status constants for tracking node setup progress
 * Maps to Ray's node initialization states
 * @type {Object}
 */
export const INSTALLATION_STATUS = {
  PENDING: 'pending',
  INSTALLING: 'installing',
  COMPLETED: 'completed',
  FAILED: 'failed'
};

/**
 * Authorization status constants for tracking node authentication
 * Used in conjunction with blockchain transaction states
 * @type {Object}
 */
export const AUTHORIZATION_STATUS = {
  PENDING: 'pending',
  AUTHORIZING: 'authorizing',
  COMPLETED: 'completed',
  FAILED: 'failed'
}; 