import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap',
    'font-sans font-medium text-sm leading-none',
    'rounded-lg transition-all duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    'disabled:pointer-events-none disabled:opacity-50',
    'select-none cursor-pointer',
  ],
  {
    variants: {
      variant: {
        default: [
          'bg-primary text-primary-foreground',
          'hover:bg-primary/90 active:scale-[0.98]',
          'shadow-sm hover:shadow-glow-primary',
        ],
        secondary: [
          'bg-secondary text-secondary-foreground',
          'hover:bg-secondary/80 active:scale-[0.98]',
        ],
        outline: [
          'border border-border bg-transparent text-foreground',
          'hover:bg-secondary hover:border-primary/50 active:scale-[0.98]',
        ],
        ghost: [
          'bg-transparent text-foreground',
          'hover:bg-secondary active:scale-[0.98]',
        ],
        destructive: [
          'bg-destructive text-destructive-foreground',
          'hover:bg-destructive/90 active:scale-[0.98]',
        ],
        gradient: [
          'bg-onda-gradient text-white font-semibold',
          'hover:opacity-90 active:scale-[0.98]',
          'shadow-glow-primary',
        ],
        link: [
          'bg-transparent text-primary underline-offset-4',
          'hover:underline p-0 h-auto',
        ],
      },
      size: {
        xs: 'h-7 px-2.5 text-xs rounded-md',
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 text-sm',
        lg: 'h-11 px-6 text-base',
        xl: 'h-12 px-8 text-base',
        icon: 'h-10 w-10 p-0',
        'icon-sm': 'h-8 w-8 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Button = React.memo(
  React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
      {
        className,
        variant,
        size,
        isLoading = false,
        leftIcon,
        rightIcon,
        children,
        disabled,
        ...props
      },
      ref,
    ) => {
      return (
        <button
          ref={ref}
          className={cn(buttonVariants({ variant, size, className }))}
          disabled={disabled || isLoading}
          aria-busy={isLoading}
          {...props}
        >
          {isLoading && (
            <span
              className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
              aria-hidden="true"
            />
          )}
          {!isLoading && leftIcon && (
            <span className="shrink-0" aria-hidden="true">{leftIcon}</span>
          )}
          {children}
          {rightIcon && (
            <span className="shrink-0" aria-hidden="true">{rightIcon}</span>
          )}
        </button>
      )
    },
  ),
)

Button.displayName = 'Button'

export { Button, buttonVariants }
