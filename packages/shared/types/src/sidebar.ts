import type { LucideIcon } from 'lucide-react';

export type SidebarItem = {
  title: string;
  icon: LucideIcon;
  path: string;
  priority?: number;
  Component?: React.ComponentType;
};
