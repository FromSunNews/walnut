// How to use this
{/* <ComingSoon
  gradientFrom="chart-3"
  gradientTo="chart-4"
  message="Our data preprocessing and training pipeline features are in development. Soon you'll be able to efficiently prepare and manage your datasets!"
/> */}

export function ComingSoon({
  gradientFrom = "chart-2",
  gradientTo = "chart-3",
  message = "This feature is currently under development."
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-sidebar-foreground">
      <div className="relative">
        <div className={`absolute -inset-0.5 bg-gradient-to-r from-${gradientFrom} to-${gradientTo} opacity-75 blur`}></div>
        <div className="relative px-7 py-4 bg-sidebar rounded-lg leading-none flex items-center">
          <span className="text-sidebar-foreground">Coming Soon</span>
        </div>
      </div>
      <p className="mt-4 text-sidebar-foreground/70 text-center max-w-md">
        {message}
      </p>
    </div>
  );
} 