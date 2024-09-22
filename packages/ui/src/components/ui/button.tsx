import { Slot } from '@radix-ui/react-slot';
import { Loader2 } from 'lucide-react';
import * as React from 'react';

import { type VariantProps, cva } from 'class-variance-authority';

import { cn } from '../../utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './tooltip';

const buttonVariants = cva(
  'inline-flex gap-2 items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  tooltip?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      isLoading,
      children,
      disabled,
      tooltip,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button';

    const _Button = (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
        disabled={isLoading || disabled}
      >
        {isLoading ? <Loader2 size={16} className="animate-spin" /> : children}
      </Comp>
    );

    if (tooltip) {
      return (
        <TooltipProvider>
          <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>{_Button}</TooltipTrigger>
            <TooltipContent>{tooltip}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return _Button;
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
