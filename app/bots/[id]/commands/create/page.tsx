import React from 'react';

import CreateCommand from '#components/command/create';

function Page({
  params,
}: {
  params: {
    id: string;
  };
}) {
  return <CreateCommand botId={params.id} />;
}

export default Page;
