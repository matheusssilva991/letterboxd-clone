import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Fundo azul claro (um pouco mais escuro), texto igual ao background da página, sombra suave
        "bg-letterboxd-input text-background placeholder:text-letterboxd-input-placeholder border-none shadow-[0_1px_6px_0_rgba(60,80,120,0.07)] h-9 w-full min-w-0 rounded-md px-3 py-1 text-base transition-all outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        // Fundo branco ao focar, texto igual ao background da página
        "focus:bg-white focus:text-background focus:placeholder:text-letterboxd-input-placeholder focus-visible:ring-0",
        className
      )}
      {...props}
    />
  )
}

export { Input }
