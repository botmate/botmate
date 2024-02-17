import React from 'react';

import PageLayout from '#components/layouts/page';
import ListWorkflow from '#components/workflow/list';

function Page({
  params,
}: {
  params: {
    id: string;
  };
}) {
  return (
    <PageLayout title="Workflows">
      <ListWorkflow botId={params.id} />
    </PageLayout>
  );
}

export default Page;
