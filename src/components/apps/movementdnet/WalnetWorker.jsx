import React, { useState, useEffect } from "react";
import {
  FaWindows,
  FaCheck,
  FaArrowLeft,
  FaArrowRight,
  FaMicrochip,
} from "react-icons/fa";
import { MdInfoOutline, MdSearch } from "react-icons/md";

import { StepProgress } from "./StepProgress";
import { DEVICE_TYPES, OPERATING_SYSTEMS } from "./utils/workerSteps";

import { useCurrentAccount } from '@mysten/dapp-kit';

import {
  Hash,
  Globe,
  Cpu,
  Activity,
  Layers,
  Share2
} from 'lucide-react';

import { useRegisterNode } from "../../../hooks/useRegisterNode";

export default function WalnetWorker() {
  const account = useCurrentAccount();
  const [currentStep, setCurrentStep] = useState(1);
  const [deviceName, setDeviceName] = useState("");
  const [selectedOS, setSelectedOS] = useState("");
  const [selectedDeviceType, setSelectedDeviceType] = useState("");
  const [nodeInfo, setNodeInfo] = useState(null);
  const [showDashboardButton, setShowDashboardButton] = useState(false);

  const STEPS = [
    {
      id: 1,
      title: "Connect New Worker",
      description: "Connect running walnet services, you can install more service packages to have more earnings and hiring rate.",
      icon: MdSearch
    },
    {
      id: 2,
      title: "Name Your Device",
      description: "Give your device a unique name to identify it in your network.",
      icon: MdInfoOutline
    },
    {
      id: 3,
      title: "Select Operating System",
      description: "Choose the operating system your device is running.",
      icon: FaWindows
    },
    {
      id: 4,
      title: "Select Computing Type",
      description: "Specify whether your device is a CPU or GPU device.",
      icon: FaMicrochip
    },
    {
      id: 5,
      title: "Script",
      description: "Run this script on your device to set up the worker.",
      icon: MdInfoOutline
    },
    {
      id: 6,
      title: "Authorize your device",
      description: "Authorize your device to connect it to the network.",
      icon: FaCheck
    }
  ];

  const isNextDisabled = () => {
    if (currentStep === 1) return false; // Always allow moving from step 1 to step 2
    if (currentStep === 2) return !deviceName; // Check if device name has been entered
    if (currentStep === 3) return !selectedOS; // Check if OS has been selected
    if (currentStep === 4) return !selectedDeviceType; // Check if device type has been selected
    return false; // No special conditions for other steps
  };

  const handleNextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const { registerNode, isAuthorizing } = useRegisterNode({
    onSuccess: (nodeData) => {
      setNodeInfo(nodeData);
      handleNextStep();
    }
  });

  const renderNavigationButtons = () => {
    const isFirstStep = currentStep === 1;
    const isLastStep = currentStep === STEPS.length;
    const isAuthStep = currentStep === 6;
    const canProceed = isAuthStep ? nodeInfo !== null : !isNextDisabled();

    return (
      <div className="flex justify-end space-x-3">
        {!isFirstStep && !isLastStep && (
          <button
            className="text-base bg-sidebar/30 text-white px-3 py-1.5 rounded-md hover:bg-sidebar-foreground/10 transition duration-300 flex items-center"
            onClick={handlePreviousStep}
          >
            <FaArrowLeft className="mr-1.5 w-3 h-3" /> Back
          </button>
        )}
        {!isFirstStep && !isLastStep && canProceed && (
          <button
            className="bg-sidebar-primary/20 border border-sidebar-primary text-sidebar-primary-foreground cursor-pointer text-base px-3 py-1.5 rounded-md hover:bg-sidebar-primary/90 transition duration-300 flex items-center"
            onClick={handleNextStep}
            disabled={!canProceed}
          >
            Next <FaArrowRight className="ml-1.5 w-3 h-3" />
          </button>
        )}
      </div>
    );
  };

  useEffect(() => {
    if (nodeInfo) {
      const timer = setTimeout(() => {
        setShowDashboardButton(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [nodeInfo]);

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="max-w-xl border-r border-white-5 mx-2 flex-col flex items-center">
        <h3 className="text-xl font-medium mb-4 text-sidebar-foreground">
          Creation Steps
        </h3>
        <div className="pl-3">
          <StepProgress
            currentStep={currentStep}
            steps={STEPS}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="space-y-1">
              <h2 className="text-lg font-medium text-sidebar-foreground">
                {STEPS[currentStep - 1].title}
              </h2>
              <p className="text-base text-muted-foreground w-full">
                {STEPS[currentStep - 1].description}
              </p>
            </div>
            <div>
              {renderNavigationButtons()}
            </div>
          </div>

          {/* Content Area */}
          <div className="mt-4 space-y-3">
            {currentStep === 1 && (
              <div className="flex items-center justify-center py-16">
                <button
                  className="bg-sidebar-primary/20 border border-sidebar-primary text-sidebar-primary-foreground px-5 py-2.5 rounded-md hover:bg-sidebar-primary/90 transition-all duration-300 text-base"
                  onClick={handleNextStep}
                >
                  Connect New Worker
                </button>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Enter device name"
                  className="w-full bg-sidebar/30 border border-white-5 rounded-md py-2.5 px-4 text-base text-sidebar-foreground placeholder-muted-foreground focus:outline-none focus:border-sidebar-primary transition-colors"
                  value={deviceName}
                  onChange={(e) => setDeviceName(e.target.value)}
                />
              </div>
            )}

            {currentStep === 3 && (
              <div className="grid grid-cols-2 gap-4">
                {OPERATING_SYSTEMS.map((os) => (
                  <div
                    key={os.name}
                    className={`flex items-center p-4 rounded-md cursor-pointer transition-all duration-300
                      ${selectedOS === os.name
                        ? "bg-sidebar-primary/20 border border-sidebar-primary"
                        : "bg-sidebar/20 hover:bg-sidebar/30 border border-transparent"
                      }`}
                    onClick={() => setSelectedOS(os.name)}
                  >
                    <div className="text-xl mr-3 text-sidebar-primary">{os.icon}</div>
                    <span className="text-base font-medium text-sidebar-foreground">{os.name}</span>
                  </div>
                ))}
              </div>
            )}

            {currentStep === 4 && (
              <div className="grid grid-cols-2 gap-4">
                {DEVICE_TYPES.map((type) => (
                  <div
                    key={type.name}
                    className={`flex items-center p-4 rounded-md cursor-pointer transition-all duration-300
                      ${selectedDeviceType === type.name
                        ? "bg-sidebar-primary/20 border border-sidebar-primary"
                        : "bg-sidebar/20 hover:bg-sidebar/30 border border-transparent"
                      }`}
                    onClick={() => setSelectedDeviceType(type.name)}
                  >
                    <div className="text-xl mr-3 text-sidebar-primary">{type.icon}</div>
                    <span className="text-base font-medium text-sidebar-foreground">{type.name}</span>
                  </div>
                ))}
              </div>
            )}

            {currentStep === 5 && (
              <div>
                <p className="text-base text-muted-foreground mb-3">
                  Copy and run the following script on your device:
                </p>
                <pre className="bg-sidebar/30 border border-white-5 p-4 rounded-md overflow-x-auto">
                  <code className="text-base text-sidebar-foreground">
                    {`curl -sSL https://walnet/install.sh | bash
walnet-worker start --name "${deviceName}" --os "${selectedOS}" --type "${selectedDeviceType}"`}
                  </code>
                </pre>
              </div>
            )}

            {currentStep === 6 && (
              <>
                {
                  nodeInfo ?
                    (
                      <div className="space-y-6">
                        <div className="bg-sidebar/30 border border-border rounded-lg p-6">
                          <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-medium text-foreground">
                              Node Information
                            </h3>
                            {nodeInfo && showDashboardButton && (
                              <button
                                className="bg-sidebar-primary text-sidebar-primary-foreground px-4 py-2 rounded-md hover:bg-sidebar-primary/90 transition-all duration-300 text-base"
                                onClick={() => null}
                              >
                                Go to Dashboard
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-6">
                            {/* ID */}
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <Hash className="w-4 h-4 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">
                                  ID
                                </p>
                              </div>
                              <p className="text-base font-medium text-foreground">
                                {nodeInfo.id}
                              </p>
                            </div>

                            {/* IP Address */}
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <Globe className="w-4 h-4 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">
                                  IP Address
                                </p>
                              </div>
                              <p className="text-base font-medium text-foreground">
                                {nodeInfo.ip}
                              </p>
                            </div>

                            {/* Architecture */}
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <Layers className="w-4 h-4 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">
                                  Architecture
                                </p>
                              </div>
                              <p className="text-base font-medium text-foreground">
                                {nodeInfo.architecture}
                              </p>
                            </div>

                            {/* Status */}
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <Activity className="w-4 h-4 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">
                                  Status
                                </p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div
                                  className={`w-2 h-2 rounded-full ${nodeInfo.state.name === "running"
                                    ? 'bg-green-600'
                                    : 'bg-red-500'
                                    }`}
                                />
                                <p className="text-base font-medium text-foreground">
                                  {nodeInfo.state.name}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* CPU Info */}
                          <div className="mt-6 pt-6 border-t border-border">
                            <div className="grid grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                  <Cpu className="w-4 h-4 text-muted-foreground" />
                                  <p className="text-sm text-muted-foreground">
                                    CPU Cores
                                  </p>
                                </div>
                                <p className="text-base font-medium text-foreground">
                                  {nodeInfo.cpu.core}
                                </p>
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                  <Share2 className="w-4 h-4 text-muted-foreground" />
                                  <p className="text-sm text-muted-foreground">
                                    Threads per Core
                                  </p>
                                </div>
                                <p className="text-base font-medium text-foreground">
                                  {nodeInfo.cpu.threadPerCore}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                    : (
                      <div className="mt-4">
                        <button
                          className="w-full bg-sidebar-primary/20 border border-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 px-4 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                          onClick={() => registerNode(account, selectedDeviceType)}
                          disabled={isAuthorizing}
                        >
                          {isAuthorizing ? (
                            <>
                              <div className="animate-spin rounded-full h-5 w-5 border-2 border-sidebar-accent border-t-sidebar-primary-foreground"></div>
                              <span>Authorizing Node...</span>
                            </>
                          ) : (
                            <span>Authorize Node</span>
                          )}
                        </button>
                      </div>
                    )
                }
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}