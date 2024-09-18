import React from 'react';

import { Button, Checkbox, Editor, PageLayout, Section } from '@botmate/ui';

import { NewUserPolicies } from '../../constants';

function NewUsers() {
  return (
    <PageLayout title="New Users">
      <div className="space-y-8">
        <Section
          title="Welcome Message"
          description="This message will be sent to new users when they join the chat."
        >
          <div>
            <Editor
              placeholder="Welcome message"
              onChange={(v) => {
                console.log('v', v);
              }}
            />
            <p className="mt-1 text-sm text-muted-foreground">
              The message can include{' '}
              <a href="#" className="text-primary">
                variables
              </a>{' '}
              to personalize the message.
            </p>
          </div>

          <Button>Save</Button>
        </Section>

        <div className="border-t-[1px] border-border" />

        <Section
          title="Policies"
          description="These policies will be applied to new users."
        >
          <div className="space-y-4">
            {NewUserPolicies.map((policy) => (
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
      </div>
    </PageLayout>
  );
}

export default NewUsers;
