import { Search } from "lucide-react";
import React from "react";

export interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Classe para o wrapper externo */
  wrapperClassName?: string;
  /** Classe para o input */
  inputClassName?: string;
  /** Classe para o ícone */
  iconClassName?: string;
  /** Mostra ou não o ícone de busca */
  showIcon?: boolean;
}

export const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
  (
    {
      wrapperClassName = "relative hidden sm:block group",
      inputClassName = "bg-letterboxd-input text-letterboxd-input-text rounded-full py-1.5 pl-3 pr-8 text-xs font-bold w-[180px] focus:outline-none focus:bg-white hover:bg-white focus:placeholder:text-gray-500 focus-visible:ring-0 transition-all duration-300 placeholder:text-transparent",
      iconClassName = "absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-letterboxd-header-border group-focus-within:text-black pointer-events-none transition-colors",
      showIcon = true,
      ...props
    },
    ref
  ) => (
    <div className={wrapperClassName}>
      <input
        ref={ref}
        type="text"
        className={inputClassName}
        {...props}
      />
      {showIcon && (
        <Search className={iconClassName} />
      )}
    </div>
  )
);

SearchBar.displayName = "SearchBar";
