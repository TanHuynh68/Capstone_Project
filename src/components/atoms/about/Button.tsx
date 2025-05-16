import { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '',
  ...props 
}: ButtonProps) {
  const baseStyles = "font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
  
  const variantStyles = {
    primary: "bg-pink-500 text-white hover:bg-pink-600 focus:ring-pink-500",
    secondary: "bg-purple-100 text-purple-700 hover:bg-purple-200 focus:ring-purple-500",
    outline: "border border-pink-300 text-pink-500 hover:bg-pink-50 focus:ring-pink-500"
  }
  
  const sizeStyles = {
    sm: "py-1 px-3 text-sm",
    md: "py-2 px-4 text-base",
    lg: "py-3 px-6 text-lg"
  }
  
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
