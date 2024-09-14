import React from 'react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Checkbox,
  PageLayout,
} from '@botmate/ui';

function HomePage() {
  return (
    <PageLayout title="Basic Settings" type="settings">
      <div>
        <Card>
          <CardHeader>
            <CardTitle className="text-md">Administrative</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Checkbox id="enable_commands" />
              <label
                htmlFor="enable_commands"
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Enable administrative commands
              </label>
            </div>
          </CardContent>
        </Card>
      </div>
      <div></div>
    </PageLayout>
  );
}

export default HomePage;
