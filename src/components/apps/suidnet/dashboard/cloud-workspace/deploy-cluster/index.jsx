import React, { useState } from "react";
import {
  FaSearch,
  FaArrowLeft,
  FaArrowRight,
  FaApple,
  FaCheck,
} from "react-icons/fa";
import ReactCountryFlag from "react-country-flag";
import { MdCloud, MdLocationOn, MdMemory } from "react-icons/md";
import {
  Clock,
  Target,
  Shield,
  Wallet
} from 'lucide-react';
import { useCurrentAccount } from "@mysten/dapp-kit";
import { StepProgress } from "../../components/StepProgress";

export default function DeployCluster() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedClusterType, setSelectedClusterType] = useState(null);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProcessor, setSelectedProcessor] = useState(null);
  const [searchProcessor, setSearchProcessor] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const account = useCurrentAccount();

  const processors = [
    { id: 1, name: "M2 Pro", count: 38, type: "apple" },
    { id: 2, name: "M2 Max", count: 27, type: "apple" },
    { id: 3, name: "M3 Pro", count: 22, type: "apple" },
    { id: 4, name: "M3", count: 18, type: "apple" },
    { id: 5, name: "M3 Max", count: 11, type: "apple" },
    { id: 6, name: "M2 Ultra", count: 6, type: "apple" },
    { id: 7, name: "GeForce RTX 3080", count: 64, type: "nvidia" },
    { id: 8, name: "H100 PCIe", count: 60, type: "nvidia" },
    { id: 9, name: "GeForce RTX 4090", count: 56, type: "nvidia" },
    { id: 10, name: "A100-PCIE-40GB", count: 24, type: "nvidia" },
    { id: 11, name: "Tesla V100-SXM2-16GB", count: 0, type: "nvidia" },
  ];

  const STEPS = [
    {
      id: 1,
      title: "Cluster Type",
      description: "Select the type of nodes aggregated in your cluster.",
      icon: MdCloud
    },
    {
      id: 2,
      title: "Location",
      description: "Choose the locations where you want to deploy your cluster.",
      icon: MdLocationOn
    },
    {
      id: 3,
      title: "Select Your Cluster Processor",
      description: "Choose the processor type for your cluster nodes.",
      icon: MdMemory
    },
    {
      id: 4,
      title: "Summary",
      description: "Review and deploy your cluster configuration.",
      icon: FaCheck
    }
  ];

  const clusterTypes = [
    {
      id: 1,
      name: "General",
      description: "Best for prototyping or general E2E Workloads",
    },
    {
      id: 2,
      name: "Train",
      description:
        "Production ready clusters for machine learning models training and fine tuning",
    },
    {
      id: 3,
      name: "Inference",
      description:
        "Production ready clusters for low latency inference and heavy workloads",
    },
  ];

  const countries = [
    { code: "vn", name: "Vietnam" },
    { code: "th", name: "Thailand" },
    { code: "sg", name: "Singapore" },
    { code: "my", name: "Malaysia" },
    { code: "id", name: "Indonesia" },
    { code: "ph", name: "Philippines" },
    { code: "mm", name: "Myanmar" },
    { code: "kh", name: "Cambodia" },
    { code: "la", name: "Laos" },
    { code: "bn", name: "Brunei" },
    { code: "tl", name: "East Timor" },
  ];

  const handleNextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleClusterTypeSelect = (id) => {
    setSelectedClusterType(id);
  };

  const handleLocationSelect = (countryCode) => {
    setSelectedLocations((prev) => {
      if (prev.includes(countryCode)) {
        return prev.filter((code) => code !== countryCode);
      } else {
        return [...prev, countryCode];
      }
    });
  };

  const handleSelectAllCountries = () => {
    if (selectedLocations.length === countries.length) {
      setSelectedLocations([]);
    } else {
      setSelectedLocations(countries.map((country) => country.code));
    }
  };

  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProcessors = processors.filter(
    (processor) =>
      processor.name.toLowerCase().includes(searchProcessor.toLowerCase()) &&
      (selectedType === "all" || processor.type === selectedType)
  );

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const { deployCluster, isDeploying } = useDeployCluster({
    onSuccess: () => {
      // Reset states after successful deployment
      setSelectedClusterType(null);
      setSelectedLocations([]);
      setSelectedProcessor(null);
      setCurrentStep(1);
    }
  });

  const handleDeployCluster = async () => {
    await deployCluster(account, {
      clusterType: selectedClusterType,
      locations: selectedLocations,
      processor: selectedProcessor
    });
  };

  const renderNavigationButtons = () => {
    const isFirstStep = currentStep === 1;
    const isLastStep = currentStep === STEPS.length;

    return (
      <div className="flex justify-end space-x-3">
        {!isFirstStep && (
          <button
            className="text-base bg-sidebar/30 text-white px-3 py-1.5 rounded-md hover:bg-sidebar-foreground/10 transition duration-300 flex items-center"
            onClick={handlePreviousStep}
          >
            <FaArrowLeft className="mr-1.5 w-3 h-3" /> Back
          </button>
        )}
        {!isLastStep && (
          <button
            className="bg-sidebar-primary/30 border border-sidebar-primary text-sidebar-primary-foreground cursor-pointer text-base px-3 py-1.5 rounded-md hover:bg-sidebar-primary/90 transition duration-300 flex items-center"
            onClick={handleNextStep}
          >
            Next <FaArrowRight className="ml-1.5 w-3 h-3" />
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-full">
      {/* Sidebar với StepProgress */}
      <div className="max-w-xl border-r border-white/10 p-4">
        <h3 className="text-lg font-medium mb-4 text-sidebar-foreground">
          Creation Steps
        </h3>
        <div className="pr-3">
          <StepProgress
            currentStep={currentStep}
            steps={STEPS}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="space-y-1">
              <h2 className="text-lg font-medium text-sidebar-foreground">
                {STEPS[currentStep - 1].title}
              </h2>
              <p className="text-base text-muted-foreground">
                {STEPS[currentStep - 1].description}
              </p>
            </div>
            <div>
              {renderNavigationButtons()}
            </div>
          </div>

          {/* Content Area */}
          <div className="mt-4 space-y-3">
            {/* Existing step content remains the same */}
            {currentStep === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {clusterTypes.map((type) => (
                  <div
                    key={type.id}
                    className={`flex items-center p-3 rounded-md cursor-pointer transition-all duration-300 ${selectedClusterType === type.id
                      ? "bg-sidebar-primary/20 border border-sidebar-primary"
                      : "bg-sidebar/30 hover:bg-sidebar/30 border border-transparent"
                      }`}
                    onClick={() => setSelectedClusterType(type.id)}
                  >
                    <div className="flex-grow">
                      <div className="text-base font-medium text-sidebar-foreground">{type.name}</div>
                      <div className="text-sm text-muted-foreground">{type.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {currentStep === 2 && (
              <div>
                <div className="relative mb-4">
                  <input
                    type="text"
                    placeholder="Search location..."
                    className="w-full bg-sidebar/30 border border-white-5 rounded-md py-2.5 pl-10 pr-4 text-base text-sidebar-foreground placeholder-muted-foreground"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <FaSearch className="absolute left-3.5 top-3 text-sidebar-foreground w-4 h-4" />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {filteredCountries.map((country) => (
                    <div
                      key={country.code}
                      className={`flex items-center p-3 rounded-md cursor-pointer transition-all duration-300 ${selectedLocations.includes(country.code)
                        ? "bg-sidebar-primary/20 border border-sidebar-primary"
                        : "bg-sidebar/30 hover:bg-sidebar border border-transparent"
                        }`}
                      onClick={() => handleLocationSelect(country.code)}
                    >
                      <ReactCountryFlag
                        countryCode={country.code}
                        svg
                        style={{
                          width: '1.25em',
                          height: '1.25em',
                        }}
                        className="mr-2.5"
                      />
                      <span className="text-base text-sidebar-foreground">{country.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div>
                <div className="flex mb-3 space-x-1.5">
                  <button
                    className={`px-6 py-1 rounded-md text-base transition-all duration-300 ${selectedType === "all"
                      ? "bg-sidebar-primary/20 border border-sidebar-primary text-sidebar-foreground"
                      : "bg-sidebar/30 hover:bg-sidebar border border-transparent text-muted-foreground"
                      }`}
                    onClick={() => setSelectedType("all")}
                  >
                    All
                  </button>
                  <button
                    className={`flex flex-row items-center px-6 py-1 rounded-md text-base transition-all duration-300 ${selectedType === "nvidia"
                      ? "bg-sidebar-primary/20 border border-sidebar-primary text-sidebar-foreground"
                      : "bg-sidebar/30 hover:bg-sidebar border border-transparent text-muted-foreground"
                      }`}
                    onClick={() => setSelectedType("nvidia")}
                  >
                    <img src={"/img/icon/nvidia.png"} className="mr-2.5 h-auto w-5" />
                    <div>NVIDIA</div>
                  </button>
                  <button
                    className={`flex flex-row items-center px-6 py-1 rounded-md text-base transition-all duration-300 ${selectedType === "apple"
                      ? "bg-sidebar-primary/20 border border-sidebar-primary text-sidebar-foreground"
                      : "bg-sidebar/30 hover:bg-sidebar border border-transparent text-muted-foreground"
                      }`}
                    onClick={() => setSelectedType("apple")}
                  >
                    <FaApple className="mr-1 w-4 h-4" />
                    <div>APPLE</div>
                  </button>
                </div>

                <div className="relative mb-3">
                  <input
                    type="text"
                    placeholder="Search for GPU..."
                    className="w-full bg-sidebar/30 border rounded-md py-1.5 pl-8 pr-3 text-base text-sidebar-foreground placeholder-gray-400"
                    value={searchProcessor}
                    onChange={(e) => setSearchProcessor(e.target.value)}
                  />
                  <FaSearch className="absolute left-2.5 top-[10px] text-sidebar-foreground w-4 h-4" />
                </div>

                <div className="grid gap-2 grid-cols-2 pr-2 pb-4">
                  {filteredProcessors.map((processor) => (
                    <div
                      key={processor.id}
                      className={`flex items-center justify-between p-3 rounded-md cursor-pointer ${selectedProcessor === processor.id
                        ? "bg-sidebar-primary/20 border border-sidebar-primary"
                        : "bg-sidebar/30 hover:bg-sidebar border border-transparent"
                        } transition-all duration-300`}
                      onClick={() => setSelectedProcessor(processor.id)}
                    >
                      <div className="flex items-center">
                        {processor.type === "apple" ? (
                          <FaApple className="text-white mr-2.5 w-5 h-5" />
                        ) : (
                          <img src={"/img/icon/nvidia.png"} className="text-white mr-2.5 w-5 h-auto" />
                        )}
                        <div>
                          <div className="text-base text-white">{processor.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {processor.type === "apple" ? "Apple Silicon" : "NVIDIA GPU"}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">{processor.count}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-4">
                {/* <div className="flex justify-between items-center mb-4">
                  <h2 className="text-base font-medium text-white">Cluster Overview</h2>
                  
                </div> */}

                <div className="space-y-4">
                  {/* Cluster Type */}
                  <div>
                    <h3 className="text-base font-medium mb-3 text-white">Cluster Type</h3>
                    <div className="flex items-center space-x-3 bg-sidebar/30 p-3 px-4 rounded-md">
                      <span className="text-base text-muted-foreground">
                        {clusterTypes.find((p) => p.id === selectedClusterType)?.name || "Not selected"}
                      </span>
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <h3 className="text-base font-medium mb-3 text-white">Location</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedLocations.slice(0, 5).map((locationCode) => {
                        const country = countries.find((c) => c.code === locationCode);
                        return (
                          <div
                            key={locationCode}
                            className="flex items-center space-x-2.5 bg-sidebar/30 px-4 py-2 rounded-md"
                          >
                            <ReactCountryFlag
                              countryCode={locationCode}
                              svg
                              style={{
                                width: '1.25em',
                                height: '1.25em',
                              }}
                              title={country ? country.name : locationCode}
                            />
                            <span className="text-base text-sidebar-foreground">{country ? country.name : locationCode}</span>
                          </div>
                        );
                      })}
                      {selectedLocations.length > 5 && (
                        <div className="bg-sidebar/30 px-4 py-2 rounded-md text-base text-gray-300">
                          +{selectedLocations.length - 5} more
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Cluster Processor */}
                  <div>
                    <h3 className="text-base font-medium mb-3 text-white">Cluster Processor</h3>
                    <div className="bg-sidebar/30 p-3 px-4 rounded-md flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        {selectedProcessor && (
                          <>
                            {processors.find((p) => p.id === selectedProcessor)?.type === "apple" ? (
                              <FaApple className="text-white w-5 h-5" />
                            ) : (
                              <img
                                src={"/img/icon/nvidia.png"}
                                className="text-white w-5 h-auto"
                              />
                            )}
                            <span className="text-base text-gray-300">
                              {processors.find((p) => p.id === selectedProcessor)?.name || "Not selected"}
                            </span>
                          </>
                        )}
                        {!selectedProcessor && <span className="text-base text-gray-300">Not selected</span>}
                      </div>
                      {selectedProcessor && (
                        <span className="text-base text-sidebar-foreground">
                          {processors.find((p) => p.name === selectedProcessor)?.count || 0}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Summary */}
                  <div>
                    <h3 className="text-lg font-medium mb-3 text-sidebar-foreground flex items-center space-x-2">
                      <span>Summary</span>
                    </h3>

                    <div className="grid grid-cols-2 gap-4 rounded-md">
                      {/* Duration */}
                      <div className="bg-sidebar/20 rounded-lg p-4 hover:bg-sidebar/30 transition-all duration-300">
                        <div className="w-10 h-10 rounded-full bg-sidebar-primary/10 flex items-center justify-center mb-3">
                          <Clock className="w-5 h-5 text-sidebar-primary" />
                        </div>
                        <div className="space-y-1">
                          <span className="text-sm text-muted-foreground">Duration</span>
                          <div className="text-base font-medium text-sidebar-foreground">168 Hours</div>
                        </div>
                      </div>

                      {/* Cluster Purpose */}
                      <div className="bg-sidebar/20 rounded-lg p-4 hover:bg-sidebar/30 transition-all duration-300">
                        <div className="w-10 h-10 rounded-full bg-sidebar-primary/10 flex items-center justify-center mb-3">
                          <Target className="w-5 h-5 text-sidebar-primary" />
                        </div>
                        <div className="space-y-1">
                          <span className="text-sm text-muted-foreground">Cluster Purpose</span>
                          <div className="text-base font-medium text-sidebar-foreground">Ray</div>
                        </div>
                      </div>

                      {/* Security */}
                      <div className="bg-sidebar/20 rounded-lg p-4 hover:bg-sidebar/30 transition-all duration-300">
                        <div className="w-10 h-10 rounded-full bg-sidebar-primary/10 flex items-center justify-center mb-3">
                          <Shield className="w-5 h-5 text-sidebar-primary" />
                        </div>
                        <div className="space-y-1">
                          <span className="text-sm text-muted-foreground">Security</span>
                          <div className="text-base font-medium text-sidebar-foreground">End-to-End Encrypted</div>
                        </div>
                      </div>

                      {/* Total Cost */}
                      <div className="bg-sidebar/20 rounded-lg p-4 hover:bg-sidebar/30 transition-all duration-300">
                        <div className="w-10 h-10 rounded-full bg-sidebar-primary/10 flex items-center justify-center mb-3">
                          <Wallet className="w-5 h-5 text-sidebar-primary" />
                        </div>
                        <div className="space-y-1">
                          <span className="text-sm text-muted-foreground">Total Cost</span>
                          <div className="flex items-center space-x-1">
                            <span className="text-base font-medium text-sidebar-primary">3.039</span>
                            <span className="text-sm text-muted-foreground">SUI</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Deploy Button */}
                    <div className="mt-8 pb-20">
                      <button
                        className="w-full bg-sidebar-primary/20 border-sidebar-primary border text-sidebar-primary-foreground cursor-pointer text-base px-4 py-3 rounded-md hover:bg-sidebar-primary/90 transition-all duration-300 flex items-center justify-center font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleDeployCluster}
                        disabled={isDeploying || !selectedClusterType || !selectedLocations.length || !selectedProcessor}
                      >
                        {isDeploying ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-sidebar-accent border-t-sidebar-primary-foreground mr-2"></div>
                            <span>Deploying Cluster...</span>
                          </>
                        ) : (
                          "Deploy Cluster"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div >
  );
}