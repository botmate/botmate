export type SidebarItem = {
  active?: boolean;
  title: string;
  description?: string;
  onClick?: () => void;
};
function SidebarItem({ active, title, description, onClick }: SidebarItem) {
  return (
    <div
      className={`p-4 rounded-xl cursor-pointer transition-all duration-150 ${
        active
          ? 'bg-gray-100 dark:bg-accent'
          : 'hover:bg-gray-100/50 dark:hover:bg-accent/50'
      }`}
      onClick={onClick}
    >
      <h2 className="font-medium">{title}</h2>
      <p className="mt-1 text-muted-foreground text-sm">{description}</p>
    </div>
  );
}

export default SidebarItem;
