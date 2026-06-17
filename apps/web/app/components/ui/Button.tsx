import React from 'react';
import Link from 'next/link';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  href?: string;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', href, isLoading, leftIcon, rightIcon, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]';
    
    const variants = {
      primary: 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.35)]',
      secondary: 'bg-white/5 hover:bg-white/10 text-foreground border border-white/10',
      outline: 'bg-transparent border border-border hover:border-emerald-500/50 text-foreground hover:bg-emerald-500/5',
      ghost: 'bg-transparent hover:bg-accent text-muted-foreground hover:text-foreground',
      danger: 'bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20',
    };

    const sizes = {
      sm: 'px-4 py-2 text-xs',
      md: 'px-6 py-3 text-sm',
      lg: 'px-8 py-4 text-base',
      icon: 'p-2',
    };

    const combinedStyles = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

    const content = (
      <>
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            {leftIcon}
            {children}
            {rightIcon}
          </>
        )}
      </>
    );

    if (href) {
      return (
        <Link href={href} className={combinedStyles}>
          {content}
        </Link>
      );
    }

    return (
      <button ref={ref} className={combinedStyles} disabled={isLoading} {...props}>
        {content}
      </button>
    );
  }
);

Button.displayName = 'Button';
