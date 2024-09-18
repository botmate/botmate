import React from 'react';

import { cn } from '../../utils';

type SectionProps = React.InputHTMLAttributes<HTMLInputElement> & {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
};
export const Section = React.forwardRef<HTMLDivElement, SectionProps>(
  ({ title, description, children, className }) => {
    return (
      <div className={cn(className, 'space-y-4')}>
        <div>
          <h2 className="text-lg font-medium">{title}</h2>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
        {children}
      </div>
    );
  },
);
