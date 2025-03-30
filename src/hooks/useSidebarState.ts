
import { useState, useEffect } from 'react';

export function useSidebarState(defaultCollapsed: boolean = false) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(defaultCollapsed);

  // Load sidebar state from localStorage if available
  useEffect(() => {
    const savedState = localStorage.getItem("sidebar-collapsed");
    if (savedState !== null) {
      setSidebarCollapsed(savedState === "true");
    }
  }, []);

  // Save sidebar state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", sidebarCollapsed.toString());
  }, [sidebarCollapsed]);

  return {
    sidebarCollapsed,
    setSidebarCollapsed
  };
}
