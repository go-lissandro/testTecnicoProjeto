import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-secondary text-secondary-foreground',
        primary: 'bg-primary/15 text-primary border border-primary/20',
        success: 'bg-success/15 text-success border border-success/20',
        warning: 'bg-warning/15 text-warning border border-warning/20',
        destructive: 'bg-destructive/15 text-destructive border border-destructive/20',
        secondary: 'bg-secondary text-muted-foreground border border-border',
        outline: 'bg-transparent border border-border text-foreground',
        gradient: 'bg-onda-gradient text-white',
      },
      size: {
        sm: 'text-2xs px-1.5 py-0.5',
        md: 'text-xs px-2 py-0.5',
        lg: 'text-sm px-3 py-1',
      },
      dot: {
        true: '',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      dot: false,
    },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, dot, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size, dot, className }))} {...props}>
      {dot && (
        <span
          className={cn('h-1.5 w-1.5 rounded-full', {
            'bg-primary': variant === 'primary',
            'bg-success': variant === 'success',
            'bg-warning': variant === 'warning',
            'bg-destructive': variant === 'destructive',
            'bg-muted-foreground': variant === 'secondary' || variant === 'default',
          })}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  )
}

export { Badge, badgeVariants }
