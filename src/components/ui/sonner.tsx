"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-right"
      duration={3000}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-forest-800 group-[.toaster]:border-forest-200 group-[.toaster]:shadow-lg group-[.toaster]:backdrop-blur-sm group-[.toaster]:rounded-xl",
          description: "group-[.toast]:text-forest-600",
          actionButton:
            "group-[.toast]:bg-lime-500 group-[.toast]:text-white group-[.toast]:hover:bg-lime-600",
          cancelButton:
            "group-[.toast]:bg-gray-100 group-[.toast]:text-forest-600 group-[.toast]:hover:bg-gray-200",
          success: "group-[.toast]:border-lime-300 group-[.toast]:bg-lime-50",
          error: "group-[.toast]:border-red-300 group-[.toast]:bg-red-50",
          warning: "group-[.toast]:border-orange-300 group-[.toast]:bg-orange-50",
          info: "group-[.toast]:border-blue-300 group-[.toast]:bg-blue-50",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
