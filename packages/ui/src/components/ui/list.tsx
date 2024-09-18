import React from 'react';

export type ListItemProps = {
  label: string;
  icon?: React.ReactNode;
  description?: string;
  isActive?: boolean;
};
export const ListItem = ({ label, description, isActive }: ListItemProps) => {
  return (
    <div
      className={`p-4 rounded-xl cursor-pointer transition-all duration-150 ${
        isActive
          ? 'bg-gray-100 dark:bg-neutral-500/20'
          : 'hover:bg-gray-100/50 dark:hover:bg-neutral-500/10'
      }`}
    >
      <h2 className="font-medium line-clamp-1">{label}</h2>
      <p className="mt-1 text-muted-foreground text-sm line-clamp-1">
        {description}
      </p>
    </div>
  );
};
