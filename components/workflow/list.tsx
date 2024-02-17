'use client';

import { trpc } from '#lib/trpc/client';
import { Button } from '#ui/button';
import { Skeleton } from '#ui/skeleton';
import React, { useState } from 'react';
import { HiOutlinePlus } from 'react-icons/hi';

import Link from 'next/link';

import NoData from '#components/no-data';

type Props = {
  botId: string;
};
function ListWorkflow({ botId }: Props) {
  const { data, isLoading } = trpc.getWorkflows.useQuery({
    botId,
  });

  if (isLoading) {
    return (
      <div className="w-80 space-y-2 p-4 overflow-hidden h-[calc(100vh-64px)]">
        {new Array(10).fill(null).map((_, index) => (
          <Skeleton key={index} className="h-20" />
        ))}
      </div>
    );
  }

  if (data?.length === 0) {
    return (
      <div className="p-4">
        <div className="mx-auto">
          <NoData
            title="No workflows"
            subTitle="Create a new workflow to get started"
            action={
              <Link href={`/bots/${botId}/workflows/create`}>
                <Button size="sm" icon={<HiOutlinePlus size={20} />}>
                  Create Workflow
                </Button>
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  return <div>CommandList</div>;
}

export default ListWorkflow;
