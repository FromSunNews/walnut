export function QuickStartCard({ step, title, description, icon: Icon }) {
  return (
    <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-sidebar/20 transition-colors">
      <div className="flex-shrink-0 size-8 rounded-full bg-sidebar-primary/20 flex items-center justify-center text-sm font-medium text-sidebar-primary">
        {step}
      </div>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Icon className="size-4 text-sidebar-primary" />
          <h3 className="font-medium">{title}</h3>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}