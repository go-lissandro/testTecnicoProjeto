import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const cardVariants = cva('rounded-xl border transition-all duration-200', {
  variants: {
    variant: {
      default: 'bg-card border-border',
      glass: [
        'bg-card/60 border-border/50',
        'backdrop-blur-md',
        'shadow-card',
      ],
      elevated: [
        'bg-card border-border',
        'shadow-card hover:shadow-card-hover',
      ],
      gradient: [
        'bg-onda-gradient border-transparent',
        'text-white shadow-glow-primary',
      ],
      outline: 'bg-transparent border-border',
    },
    padding: {
      none: 'p-0',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    },
    interactive: {
      true: 'cursor-pointer hover:-translate-y-0.5 active:translate-y-0',
      false: '',
    },
  },
  defaultVariants: {
    variant: 'default',
    padding: 'md',
    interactive: false,
  },
})

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.memo(
  React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant, padding, interactive, ...props }, ref) => (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, padding, interactive, className }))}
        {...props}
      />
    ),
  ),
)
Card.displayName = 'Card'

// ---- Card Header -----------------------------------------
const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col gap-1.5', className)} {...props} />
  ),
)
CardHeader.displayName = 'CardHeader'

// ---- Card Title ------------------------------------------
const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('font-display font-semibold text-lg leading-tight tracking-tight', className)}
      {...props}
    />
  ),
)
CardTitle.displayName = 'CardTitle'

// ---- Card Description ------------------------------------
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground leading-relaxed', className)}
    {...props}
  />
))
CardDescription.displayName = 'CardDescription'

// ---- Card Content ----------------------------------------
const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('mt-4', className)} {...props} />
  ),
)
CardContent.displayName = 'CardContent'

// ---- Card Footer -----------------------------------------
const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center justify-between mt-4 pt-4 border-t border-border', className)}
      {...props}
    />
  ),
)
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
