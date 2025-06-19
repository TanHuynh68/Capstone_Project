import React from "react";
import { Search } from "lucide-react";

interface SidebarSearchBarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: () => void;
  placeholder?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  loading?: boolean;
  className?: string;
}

const SidebarSearchBar: React.FC<SidebarSearchBarProps> = ({
  value,
  onChange,
  onSearch,
  placeholder = "Tìm kiếm...",
  onKeyDown,
  loading = false,
  className = "",
}) => (
  <div className={`relative mb-4 ${className}`}>
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground pr-10"
    />
    <button
      type="button"
      onClick={onSearch}
      disabled={loading}
      className="absolute right-0 top-0 h-full px-3 flex items-center justify-center text-muted-foreground hover:text-primary focus:outline-none"
      tabIndex={-1}
    >
      <Search className="h-4 w-4" />
    </button>
  </div>
);

export default SidebarSearchBar;
