import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const inputVariants = cva(
  [
    'flex w-full rounded-lg border bg-input px-3 py-2',
    'text-sm text-foreground placeholder:text-muted-foreground',
    'transition-all duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'file:border-0 file:bg-transparent file:text-sm file:font-medium',
  ],
  {
    variants: {
      variant: {
        default: 'border-border hover:border-muted-foreground focus-visible:border-primary',
        error: 'border-destructive hover:border-destructive focus-visible:ring-destructive',
        success: 'border-success hover:border-success focus-visible:ring-success',
      },
      inputSize: {
        sm: 'h-8 text-xs px-2.5',
        md: 'h-10',
        lg: 'h-12 text-base px-4',
      },
    },
    defaultVariants: {
      variant: 'default',
      inputSize: 'md',
    },
  },
)

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    Omit<VariantProps<typeof inputVariants>, 'inputSize'> {
  inputSize?: 'sm' | 'md' | 'lg'
  /** Ícone à esquerda */
  leftIcon?: React.ReactNode
  /** Ícone à direita */
  rightIcon?: React.ReactNode
  /** Mensagem de erro */
  error?: string
  /** Label acima do input */
  label?: string
  /** Texto de ajuda abaixo do input */
  hint?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      variant,
      inputSize = 'md',
      leftIcon,
      rightIcon,
      error,
      label,
      hint,
      id,
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId()
    const inputId = id ?? generatedId
    const hasError = Boolean(error)

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-foreground leading-none"
          >
            {label}
            {props.required && (
              <span className="text-destructive ml-1" aria-hidden="true">*</span>
            )}
          </label>
        )}

        {/* Input wrapper com ícones */}
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3 flex items-center text-muted-foreground pointer-events-none z-10">
              {leftIcon}
            </span>
          )}

          <input
            id={inputId}
            type={type}
            ref={ref}
            aria-invalid={hasError}
            aria-describedby={
              hasError ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
            }
            className={cn(
              inputVariants({
                variant: hasError ? 'error' : variant,
                inputSize,
              }),
              leftIcon && 'pl-9',
              rightIcon && 'pr-9',
              className,
            )}
            {...props}
          />

          {rightIcon && (
            <span className="absolute right-3 flex items-center text-muted-foreground pointer-events-none z-10">
              {rightIcon}
            </span>
          )}
        </div>

        {/* Mensagem de erro */}
        {hasError && (
          <p
            id={`${inputId}-error`}
            role="alert"
            className="text-xs text-destructive flex items-center gap-1"
          >
            {error}
          </p>
        )}

        {/* Texto de ajuda */}
        {!hasError && hint && (
          <p id={`${inputId}-hint`} className="text-xs text-muted-foreground">
            {hint}
          </p>
        )}
      </div>
    )
  },
)

Input.displayName = 'Input'

export { Input }
