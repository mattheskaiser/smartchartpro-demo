"use client"

import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      position="top-center"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-gray-900 group-[.toaster]:border-2 group-[.toaster]:shadow-xl group-[.toaster]:rounded-lg group-[.toaster]:p-4 group-[.toaster]:font-sans",
          title: "group-[.toast]:text-sm group-[.toast]:font-semibold",
          description: "group-[.toast]:text-sm group-[.toast]:text-gray-600",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-white group-[.toast]:hover:bg-blue-700 group-[.toast]:px-3 group-[.toast]:py-1.5 group-[.toast]:rounded-md group-[.toast]:font-medium",
          cancelButton:
            "group-[.toast]:bg-gray-100 group-[.toast]:text-gray-700 group-[.toast]:hover:bg-gray-200 group-[.toast]:px-3 group-[.toast]:py-1.5 group-[.toast]:rounded-md group-[.toast]:font-medium",
          success: "group-[.toast]:border-green-300 group-[.toast]:bg-white [&>div>svg]:text-green-600 [&>div>div>div:first-child]:text-green-900 [&>div>div>div:last-child]:text-green-700",
          error: "group-[.toast]:border-red-300 group-[.toast]:bg-white [&>div>svg]:text-red-600 [&>div>div>div:first-child]:text-red-900 [&>div>div>div:last-child]:text-red-700",
          warning: "group-[.toast]:border-yellow-300 group-[.toast]:bg-white [&>div>svg]:text-yellow-600 [&>div>div>div:first-child]:text-yellow-900 [&>div>div>div:last-child]:text-yellow-700",
          info: "group-[.toast]:border-blue-300 group-[.toast]:bg-white [&>div>svg]:text-blue-600 [&>div>div>div:first-child]:text-blue-900 [&>div>div>div:last-child]:text-blue-700",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
