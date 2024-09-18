import React from 'react';

import { Button, Checkbox, PageLayout, Section } from '@botmate/ui';

import { AntiSpam } from '../../constants';

function AntiSpamPage() {
  return (
    <PageLayout title="Anti-spam">
      <Section
        // title="Configure"
        description="Configure the basic settings for the anti-spam system."
      >
        <div className="space-y-4">
          {AntiSpam.map((policy) => (
            <div className="flex items-center space-x-2">
              <Checkbox
                id={policy.key}
                // checked={config.get('enabled')}
                onCheckedChange={(checked) => {
                  // config.save('enabled', Boolean(checked));
                }}
              />
              <label
                htmlFor={policy.key}
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {policy.label}
              </label>
            </div>
          ))}
        </div>
        <Button>Save</Button>
      </Section>
    </PageLayout>
  );
}

export default AntiSpamPage;
