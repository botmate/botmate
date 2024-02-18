import React from 'react';

import CreateCommand from '#components/command/create';
import PageLayout from '#components/layouts/page';

function Page() {
  return (
    <PageLayout title="Create Command">
      <CreateCommand />
    </PageLayout>
  );
}

export default Page;
