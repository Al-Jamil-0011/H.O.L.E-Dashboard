"use client";

import * as React from "react";
import { Moon, Sun, Monitor, Check, ChevronDown } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const themes = [
    { id: "light", name: "Light Mode", icon: Sun },
    { id: "dark", name: "Dark Mode", icon: Moon },
    { id: "system", name: "Device", icon: Monitor },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200"
      >
        {!mounted ? (
          <>
            <Monitor className="h-4 w-4" />
            <span className="hidden sm:inline capitalize">Theme</span>
          </>
        ) : (
          <>
            {theme === "light" && <Sun className="h-4 w-4" />}
            {theme === "dark" && <Moon className="h-4 w-4" />}
            {(theme === "system" || !theme) && <Monitor className="h-4 w-4" />}
            <span className="hidden sm:inline capitalize">{theme}</span>
          </>
        )}
        <ChevronDown className={cn("h-3 w-3 transition-transform duration-200", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl border border-border bg-card shadow-lg z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="p-1.5 flex flex-col gap-1">
            {themes.map((t) => {
              const Icon = t.icon;
              const isActive = theme === t.id;
              
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    setTheme(t.id);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors",
                    isActive 
                      ? "bg-primary/10 text-primary font-semibold" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4" />
                    <span>{t.name}</span>
                  </div>
                  {isActive && <Check className="h-3.5 w-3.5" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
