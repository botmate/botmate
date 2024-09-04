import React from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@botmate/ui';

import useCurrentBot from '../../../hooks/use-bot';
import PageLayout from '../../../layouts/page';

function GeneralSettingsPage() {
  const bot = useCurrentBot();
  return (
    <PageLayout
      page="settings"
      title="General"
      subtitle="Configure general settings for the bot"
    >
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg">About</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {[
              {
                title: 'ID',
                value: bot.botId,
              },
              {
                title: 'Name',
                value: bot.name,
              },
            ].map((item) => {
              return (
                <div key={item.title} className="flex flex-col">
                  <span className="text-sm text-muted-foreground">
                    {item.title}
                  </span>
                  <span className="text-lg">{item.value}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </PageLayout>
  );
}

export default GeneralSettingsPage;
