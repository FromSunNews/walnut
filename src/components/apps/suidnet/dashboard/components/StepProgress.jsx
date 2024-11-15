import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const StepProgress = ({ currentStep, steps }) => {
  const [animatedStep, setAnimatedStep] = useState(currentStep);

  useEffect(() => {
    setAnimatedStep(currentStep);
  }, [currentStep]);

  const getStepColor = (stepIndex) => {
    if (stepIndex < currentStep - 1) return 'completed';
    if (stepIndex === currentStep - 1) return 'current';
    return 'upcoming';
  };

  const stepColors = {
    completed: {
      border: 'border-sidebar-primary',
      bg: 'bg-sidebar-primary/10',
      icon: 'bg-sidebar-primary text-sidebar-primary-foreground',
      line: 'bg-sidebar-primary',
      text: 'text-sidebar-primary'
    },
    current: {
      border: 'border-sidebar-accent',
      bg: 'bg-sidebar-accent/10',
      icon: 'bg-sidebar-accent text-sidebar-accent-foreground',
      line: 'bg-sidebar-border',
      text: 'text-sidebar-accent'
    },
    upcoming: {
      border: 'border-sidebar-border',
      bg: 'bg-sidebar/20',
      icon: 'bg-sidebar-border text-muted-foreground',
      line: 'bg-sidebar-border',
      text: 'text-muted-foreground'
    }
  };

  return (
    <div className="overflow-y-auto pr-3 custom-scrollbar py-6">
      <ol className="relative space-y-8 min-w-[280px]">
        {steps.map((step, index) => {
          const status = getStepColor(index);
          const Icon = step.icon;

          return (
            <motion.li
              key={step.id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`relative flex-1 ${index !== steps.length - 1 ? 'pb-8' : ''}`}
            >
              {index !== steps.length - 1 && (
                <motion.div
                  className={`absolute left-[36px] top-14 w-0.5 transition-colors duration-500 ${stepColors[status].line}`}
                  style={{
                    height: 'calc(100% + 2.5rem)',
                  }}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                />
              )}

              <motion.div
                className="relative flex items-center group"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2, delay: index * 0.1 }}
              >
                <motion.div
                  className={`flex items-center justify-center w-full max-w-[320px] ${stepColors[status].bg} p-4 rounded-lg border transition-all duration-300 ${stepColors[status].border} hover:shadow-lg hover:shadow-black/20`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div
                    className={`rounded-md ${stepColors[status].icon} p-2.5 mr-4 transition-colors duration-300`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.div>

                  <div className="flex-grow">
                    <motion.h6
                      className={`text-base font-medium mb-1 text-white`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
                    >
                      {step.title}
                    </motion.h6>
                    <motion.p
                      className="text-sm text-gray-400"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 + 0.3 }}
                    >
                      {step.description}
                    </motion.p>
                  </div>

                  {status === 'completed' && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-4 rounded-full bg-green-500 p-1"
                    >
                      <svg
                        className="w-4 h-4 text-black"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
}; 