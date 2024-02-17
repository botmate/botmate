import React from 'react';

type Props = {
  title: string;
};
function PageTitle({ title }: Props) {
  return (
    <div className="flex items-center px-4 h-16 border-b">
      <h1 className="text-2xl font-semibold">{title}</h1>
    </div>
  );
}

export default PageTitle;
