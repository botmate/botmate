import React from 'react';

import ListCommand from '#components/command/list';
import PageLayout from '#components/layouts/page';

function Page({
  params,
}: {
  params: {
    id: string;
  };
}) {
  return (
    <PageLayout title="Commands">
      <ListCommand botId={params.id} />
    </PageLayout>
  );
}

export default Page;
