import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-orange-600 text-white hover:bg-orange-700 focus-visible:ring-orange-500',
        secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus-visible:ring-gray-500',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',
        success: 'bg-green-600 text-white hover:bg-green-700 focus-visible:ring-green-500',
        warning: 'bg-purple-600 text-white hover:bg-purple-700 focus-visible:ring-purple-500',
      },
      size: {
        sm: 'px-3 py-2 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

interface ButtonProps 
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: ReactNode;
}

const Button = ({ className, variant, size, children, ...props }: ButtonProps) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {children}
    </button>
  );
};

export { Button, type ButtonProps };