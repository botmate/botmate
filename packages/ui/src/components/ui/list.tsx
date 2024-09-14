import React from 'react';

export type ListItemProps = {
  label: string;
  icon?: React.ReactNode;
  description?: string;
  isActive?: boolean;
};
export const ListItem = ({
  label,
  icon,
  description,
  isActive,
}: ListItemProps) => {
  return (
    <div
      className={`p-4 rounded-xl cursor-pointer transition-all duration-150 ${isActive ? 'bg-gray-100 dark:bg-neutral-800' : 'hover:bg-gray-100/50 dark:hover:bg-neutral-800'}`}
    >
      <h2 className="font-medium">{label}</h2>
      <p className="mt-1 text-muted-foreground text-sm">{description}</p>
    </div>
  );
};
