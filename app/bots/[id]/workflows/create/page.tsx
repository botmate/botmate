import React from 'react';

import PageLayout from '#components/layouts/page';
import CreateWorkflow from '#components/workflow/create';

function Page() {
  return (
    <PageLayout title="Create Workflow">
      <CreateWorkflow />
    </PageLayout>
  );
}

export default Page;
