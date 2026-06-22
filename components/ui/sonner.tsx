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
      position="bottom-right"
      toastOptions={{
        // ✅ Solid white background + black text — visible on any page bg
        style: {
          background: "#ffffff",
          color: "#111111",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
          fontWeight: "500",
          fontSize: "13.5px",
          padding: "12px 16px",
        },
        classNames: {
          toast: "group toast",
          description: "group-[.toast]:text-gray-500",
          actionButton: "group-[.toast]:bg-black group-[.toast]:text-white",
          cancelButton: "group-[.toast]:bg-gray-100 group-[.toast]:text-gray-700",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
