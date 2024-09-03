import React from 'react';

import { Card, CardDescription, CardHeader, CardTitle } from '@botmate/ui';

const stats = [
  {
    id: 'name',
    label: 'Bot Name',
    value: 'Snazzy',
  },
];

function BotOverview() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-5 gap-4"></div>
    </div>
  );
}

export default BotOverview;
