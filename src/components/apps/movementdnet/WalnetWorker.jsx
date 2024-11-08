import React, { useState } from "react";
import {
  FaDesktop,
  FaWindows,
  FaCheck,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import { MdInfoOutline, MdSearch } from "react-icons/md";

// import { useWallet } from "../hooks/useWallet";
import { StepProgress } from "./StepProgress";
import { DEVICE_TYPES, OPERATING_SYSTEMS } from "./utils/workerSteps";
import { toast } from "../../shared/use-toast";

export default function WalnetWorker() {
  // const { account, signAndSubmitTransaction, waitTransaction } = useWallet();
  const [currentStep, setCurrentStep] = useState(1);
  const [deviceName, setDeviceName] = useState("");
  const [selectedOS, setSelectedOS] = useState("");
  const [selectedDeviceType, setSelectedDeviceType] = useState("");

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
      title: "Select Device Type",
      description: "Specify whether your device is a desktop or mobile device.",
      icon: FaDesktop
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
    },
    {
      id: 7,
      title: "You're all set!",
      description: "Congratulations! Your device is now connected and ready to work.",
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

  const handleAuthorizeDevice = () => {
    handleNextStep();
  }
  // const handleAuthorizeDevice = async () => {
  //   if (!account) {
  //     toast.error("Please connect your wallet first!");
  //     return;
  //   }

  //   try {
  //     const transactionId = await signAndSubmitTransaction({
  //       signer: account.address,
  //       // Add necessary transaction details here
  //     });

  //     const result = await waitTransaction(transactionId);

  //     console.log("Authorization Result:", result);

  //     toast({
  //       title: "Device Authorization",
  //       description: "Device authorized successfully",
  //     });

  //     handleNextStep();
  //   } catch (error) {
  //     console.error("Error authorizing device:", error);
  //     toast({
  //       title: "Error",
  //       description: "Failed to authorize device. Please try again.",
  //     });
  //   }
  // };

  const renderNavigationButtons = () => {
    const isFirstStep = currentStep === 1;
    const isLastStep = currentStep === STEPS.length;
    const isAuthStep = currentStep === 6;

    return (
      <div className="flex justify-end space-x-3">
        {!isFirstStep && !isLastStep && !isAuthStep && (
          <button
            className="text-base bg-white/10 text-white px-3 py-1.5 rounded-md hover:bg-white/20 transition duration-300 flex items-center"
            onClick={handlePreviousStep}
          >
            <FaArrowLeft className="mr-1.5 w-3 h-3" /> Back
          </button>
        )}
        {!isFirstStep && !isLastStep && !isAuthStep && (
          <button
            className="bg-blue-600 cursor-pointer text-base text-white px-3 py-1.5 rounded-md hover:bg-blue-700 transition duration-300 flex items-center"
            onClick={handleNextStep}
            disabled={isNextDisabled()}
          >
            Next <FaArrowRight className="ml-1.5 w-3 h-3" />
          </button>
        )}
      </div>
    );
  };

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
                  className="bg-sidebar-primary text-sidebar-primary-foreground px-5 py-2.5 rounded-md hover:bg-sidebar-primary/90 transition-all duration-300 text-base"
                  onClick={handleNextStep}
                >
                  Connect New Worker +
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
              <div className="text-center py-8">
                <button
                  className="bg-sidebar-primary text-sidebar-primary-foreground px-5 py-2.5 rounded-md hover:bg-sidebar-primary/90 transition-all duration-300 text-base font-medium"
                  onClick={handleAuthorizeDevice}
                >
                  Authorize Device
                </button>
              </div>
            )}

            {currentStep === 7 && (
              <div className="text-center py-8">
                <p className="text-base text-muted-foreground mb-4">
                  Your device has been successfully connected and authorized.
                </p>
                <FaCheck className="w-10 h-10 text-green-500 mx-auto mb-4" />
                <button
                  className="bg-sidebar-primary text-sidebar-primary-foreground px-4 py-2 rounded-md hover:bg-sidebar-primary/90 transition-all duration-300 text-base"
                  onClick={() => setCurrentStep(1)}
                >
                  Connect Another Device
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}