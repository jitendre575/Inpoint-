"use client"

/**
 * Download Mobile App Button Component
 * 
 * A reusable button component that links to the mobile app download page.
 * Can be used in headers, footers, or anywhere in the application.
 */

interface DownloadAppButtonProps {
    variant?: 'default' | 'outline' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
    className?: string
    showIcon?: boolean
}

export function DownloadAppButton({
    variant = 'default',
    size = 'md',
    className = '',
    showIcon = true
}: DownloadAppButtonProps) {

    const playstoreUrl = process.env.NEXT_PUBLIC_PLAYSTORE_URL || "https://play.google.com/store"

    // Size classes
    const sizeClasses = {
        sm: 'h-8 px-3 text-sm gap-1.5',
        md: 'h-10 px-4 text-base gap-2',
        lg: 'h-12 px-6 text-lg gap-3'
    }

    // Variant classes
    const variantClasses = {
        default: 'bg-gradient-to-r from-emerald-500 to-rose-500 hover:from-emerald-600 hover:to-rose-600 text-white shadow-lg hover:shadow-xl',
        outline: 'bg-transparent border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950',
        ghost: 'bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur-sm'
    }

    // Icon size based on button size
    const iconSizes = {
        sm: 'h-4 w-4',
        md: 'h-5 w-5',
        lg: 'h-6 w-6'
    }

    return (
        <a
            href={playstoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`
        inline-flex items-center justify-center
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        font-medium rounded-lg
        transition-all duration-300
        group
        ${className}
      `}
        >
            {showIcon && (
                <svg
                    className={`${iconSizes[size]} group-hover:scale-110 transition-transform`}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                >
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                </svg>
            )}
            <span>Download App</span>
        </a>
    )
}
