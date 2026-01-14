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
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-gray-900 group-[.toaster]:border-2 group-[.toaster]:shadow-xl group-[.toaster]:rounded-lg group-[.toaster]:p-4",
          description: "group-[.toast]:text-gray-600 group-[.toast]:text-sm",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-white group-[.toast]:hover:bg-blue-700 group-[.toast]:px-3 group-[.toast]:py-1.5 group-[.toast]:rounded-md",
          cancelButton:
            "group-[.toast]:bg-gray-100 group-[.toast]:text-gray-700 group-[.toast]:hover:bg-gray-200 group-[.toast]:px-3 group-[.toast]:py-1.5 group-[.toast]:rounded-md",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
