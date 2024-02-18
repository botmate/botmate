import React from 'react';

type Props = {
  title: string;
};
function PageTitle({ title }: Props) {
  return (
    <div className="border-b bg-white sticky top-0">
      <div className="flex items-center px-4 h-16 border-b bg-white sticky top-0">
        <h1 className="text-xl font-semibold">{title}</h1>
      </div>
    </div>
  );
}

export default PageTitle;
