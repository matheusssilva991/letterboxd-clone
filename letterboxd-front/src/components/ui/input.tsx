import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Fundo azul claro (um pouco mais escuro), texto cinza escuro, sombra suave
        "bg-[#d3e2ef] text-[#6c7a89] placeholder:text-[#A0B2C2] border-none shadow-[0_1px_6px_0_rgba(60,80,120,0.07)] h-9 w-full min-w-0 rounded-md px-3 py-1 text-base transition-all outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        // Fundo branco ao focar, mantém cor do texto padrão
        "focus:bg-white focus:placeholder:text-gray-500 focus-visible:ring-0",
        className
      )}
      {...props}
    />
  )
}

export { Input }
