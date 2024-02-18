import { BotData } from '#types';
import { Button } from '#ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '#ui/card';
import React from 'react';

import Link from 'next/link';

type Props = {
  id: string;
  name: string;
  onDelete: () => void;
};
function BotCard({ name, id, onDelete }: Props) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between">
          <div>
            <CardTitle>{name}</CardTitle>
            <CardDescription>{id}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/bots/${id}`}>
              <Button size="sm" variant={'outline'}>
                Manage
              </Button>
            </Link>
            <Button size="sm" variant={'destructive'} onClick={onDelete}>
              Delete
            </Button>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}

export default BotCard;
