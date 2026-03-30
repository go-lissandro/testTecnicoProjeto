import { Link, type LinkProps } from 'react-router-dom'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const linkButtonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap',
    'font-sans font-medium text-sm leading-none',
    'rounded-lg transition-all duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    'select-none',
  ],
  {
    variants: {
      variant: {
        default: ['bg-primary text-primary-foreground', 'hover:bg-primary/90 active:scale-[0.98]', 'shadow-sm'],
        secondary: ['bg-secondary text-secondary-foreground', 'hover:bg-secondary/80 active:scale-[0.98]'],
        outline: ['border border-border bg-transparent text-foreground', 'hover:bg-secondary hover:border-primary/50 active:scale-[0.98]'],
        ghost: ['bg-transparent text-foreground', 'hover:bg-secondary active:scale-[0.98]'],
        gradient: ['bg-onda-gradient text-white font-semibold', 'hover:opacity-90 active:scale-[0.98]', 'shadow-glow-primary'],
      },
      size: {
        xs: 'h-7 px-2.5 text-xs rounded-md',
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 text-sm',
        lg: 'h-11 px-6 text-base',
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

interface LinkButtonProps extends LinkProps, VariantProps<typeof linkButtonVariants> {
  className?: string
}

export function LinkButton({ className, variant, size, children, ...props }: LinkButtonProps) {
  return (
    <Link
      className={cn(linkButtonVariants({ variant, size, className }))}
      {...props}
    >
      {children}
    </Link>
  )
}
