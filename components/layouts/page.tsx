import React from 'react';

import PageTitle from '#components/page-title';

type Props = {
  title: string;
  children?: React.ReactNode;
};
function PageLayout({ title, children }: Props) {
  return (
    <div className="flex flex-col h-full">
      <PageTitle title={title} />

      <div className="flex-1 h-full">{children}</div>
    </div>
  );
}

export default PageLayout;
