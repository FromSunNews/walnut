import { cn } from "../../../utils/tailwind_merge"
import { Button } from "./button"

export function ButtonWithAnimation({
  icon: Icon, // Component icon từ lucide
  title,
  direction = 'left', // 'left' hoặc 'right'
  onClick,
  className,
  variant = 'ghost',
  ...props
}) {
  return (
    <Button
      variant={variant}
      onClick={onClick}
      className={cn(
        "group/animated-btn bg-sidebar hover:bg-sidebar-foreground/20 relative overflow-hidden",
        "animate-in fade-in-50 duration-300",
        "border border-sidebar-accent",
        className
      )}
      {...props}
    >
      {/* Icon với animation */}
      <div className={cn(
        "transition-transform duration-300",
        direction === 'left'
          ? "group-hover/animated-btn:-translate-x-1"
          : "group-hover/animated-btn:translate-x-1"
      )}>
        <Icon className="h-4 w-4" />
      </div>

      {/* Text với animation */}
      <span className={cn(
        "transition-transform duration-300",
        direction === 'left'
          ? "group-hover/animated-btn:translate-x-[-2px]"
          : "group-hover/animated-btn:translate-x-[2px]"
      )}>
        {title}
      </span>

      {/* Hiệu ứng shine */}
      <div className="absolute inset-0 w-[200%] -translate-x-full
        group-hover/animated-btn:translate-x-[50%] duration-1000
        bg-gradient-to-r from-transparent via-white/5 to-transparent"
      />
    </Button>
  )
} 