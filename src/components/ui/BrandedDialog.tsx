import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { BrandedIcon } from "./BrandedIcon"
import { OptimizedVideoAnimation } from "../performance/OptimizedVideoAnimation"
import { getAnimationUrl } from "@/utils/supabaseIcons"

const BrandedDialog = DialogPrimitive.Root

const BrandedDialogTrigger = DialogPrimitive.Trigger

const BrandedDialogPortal = DialogPrimitive.Portal

const BrandedDialogClose = DialogPrimitive.Close

interface BrandedDialogOverlayProps 
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay> {
  variant?: 'default' | 'celebration' | 'premium'
}

const BrandedDialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  BrandedDialogOverlayProps
>(({ className, variant = 'default', ...props }, ref) => {
  const overlayClasses = {
    default: "bg-black/80 backdrop-blur-sm",
    celebration: "bg-gradient-to-br from-purple-900/50 to-cyan-900/50 backdrop-blur-md",
    premium: "bg-gradient-to-br from-purple-900/60 via-black/70 to-cyan-900/60 backdrop-blur-lg"
  }

  return (
    <DialogPrimitive.Overlay
      ref={ref}
      className={cn(
        "fixed inset-0 z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        overlayClasses[variant],
        className
      )}
      {...props}
    />
  )
})
BrandedDialogOverlay.displayName = DialogPrimitive.Overlay.displayName

interface BrandedDialogContentProps 
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  variant?: 'default' | 'celebration' | 'premium'
  icon?: 'achievement' | 'learning' | 'growth' | 'mission' | 'network' | 'communication' | 'data' | 'workflow'
  showAnimation?: boolean
}

const BrandedDialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  BrandedDialogContentProps
>(({ className, children, variant = 'default', icon, showAnimation = true, ...props }, ref) => {
  const contentClasses = {
    default: "bg-background border shadow-lg",
    celebration: "bg-gradient-to-br from-purple-50 to-cyan-50 border border-purple-200/50 shadow-2xl",
    premium: "bg-gradient-to-br from-white via-purple-50/30 to-cyan-50/30 border border-purple-300/30 shadow-2xl backdrop-blur-sm"
  }

  return (
    <BrandedDialogPortal>
      <BrandedDialogOverlay variant={variant} />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-6 p-6 duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-xl",
          contentClasses[variant],
          className
        )}
        {...props}
      >
        {/* Animated Icon Header */}
        {icon && showAnimation && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
            className="flex justify-center -mt-2"
          >
            <div className="w-16 h-16 mb-4">
              <OptimizedVideoAnimation
                src={getAnimationUrl('dialog-header-glow.mp4')}
                fallbackIcon={
                  <BrandedIcon 
                    type={icon} 
                    variant="animated" 
                    size="xl" 
                    context="ui"
                  />
                }
                className="w-full h-full"
                context="ui"
                loop={true}
              />
            </div>
          </motion.div>
        )}

        {children}
        
        <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-all duration-200 hover:opacity-100 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>

        {/* Decorative Elements for Premium/Celebration */}
        {(variant === 'celebration' || variant === 'premium') && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-purple-400 rounded-full opacity-60"
                style={{
                  left: `${10 + (i * 15)}%`,
                  top: `${20 + (i % 3) * 20}%`,
                }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 0.6, 0],
                }}
                transition={{
                  duration: 3,
                  delay: i * 0.2,
                  repeat: Infinity,
                  repeatDelay: 2,
                }}
              />
            ))}
          </>
        )}
      </DialogPrimitive.Content>
    </BrandedDialogPortal>
  )
})
BrandedDialogContent.displayName = DialogPrimitive.Content.displayName

const BrandedDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
BrandedDialogHeader.displayName = "BrandedDialogHeader"

const BrandedDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
BrandedDialogFooter.displayName = "BrandedDialogFooter"

interface BrandedDialogTitleProps 
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title> {
  gradient?: boolean
}

const BrandedDialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  BrandedDialogTitleProps
>(({ className, gradient = false, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-xl font-bold leading-none tracking-tight",
      gradient && "bg-gradient-to-r from-primary to-brand-cyan bg-clip-text text-transparent",
      className
    )}
    {...props}
  />
))
BrandedDialogTitle.displayName = DialogPrimitive.Title.displayName

const BrandedDialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground leading-relaxed", className)}
    {...props}
  />
))
BrandedDialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  BrandedDialog,
  BrandedDialogPortal,
  BrandedDialogOverlay,
  BrandedDialogClose,
  BrandedDialogTrigger,
  BrandedDialogContent,
  BrandedDialogHeader,
  BrandedDialogFooter,
  BrandedDialogTitle,
  BrandedDialogDescription,
}