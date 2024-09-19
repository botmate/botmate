import React from 'react';

import { usePluginConfig } from '@botmate/client';
import {
  Button,
  Checkbox,
  Input,
  PageLayout,
  Section,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@botmate/ui';

import type { Config } from '../../config.types';

function HomePage() {
  const config = usePluginConfig<Config>();

  return (
    <PageLayout title="Moderation">
      <div className="space-y-8">
        <Section
          title="Administrative"
          description="These settings are applied to administrative commands."
        >
          <div className="flex items-center space-x-2">
            <Checkbox
              id="enable_commands"
              checked={config.get('enabled')}
              onCheckedChange={(checked) => {
                config.save('enabled', Boolean(checked));
              }}
            />
            <label
              htmlFor="enable_commands"
              className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Enable administrative commands
            </label>
          </div>
        </Section>

        <div className="border-t-[1px] border-border" />

        <Section title="Warning System">
          <div>
            <div>
              <label htmlFor="max_count">Maximum</label>
              <p className="text-sm text-muted-foreground mt-1">
                Maximum number of warnings a user can receive before action is
                taken.
              </p>
            </div>
            <div className="mt-2">
              <Input type="number" id="max_count" defaultValue={3} />
            </div>
          </div>
          <div className="flex items-center justify-between gap-8">
            <div>
              <label htmlFor="max_count">Action</label>
              <p className="text-sm text-muted-foreground mt-1">
                Action to be taken when the user reaches the maximum number of
                warnings.
              </p>
            </div>
            <div className="max-w-52">
              <Select>
                <SelectTrigger className="w-52">
                  <SelectValue placeholder="Ban" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="ban">Ban</SelectItem>
                    <SelectItem value="kick">Kick</SelectItem>
                    <SelectItem value="mute">Mute</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button>Save</Button>
        </Section>
      </div>
      <div></div>
    </PageLayout>
  );
}

export default HomePage;
