import React, { useRef } from 'react';

import { toast, usePluginConfig } from '@botmate/client';
import { Button, Input, Label } from '@botmate/ui';

import { Config } from '../config.types';

function SettingsPage() {
  const config = usePluginConfig<Config>();

  const apiKeyRef = useRef<HTMLInputElement>(null);
  const defaultValue = config.get('key', '');

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="key">OpenAI API Key</Label>
        <Input
          id="key"
          placeholder="Enter your OpenAI API key (eg. sk-....P20J)"
          ref={apiKeyRef}
          defaultValue={defaultValue}
          className="mt-1"
        />
        <p className="text-sm text-muted-foreground mt-1">
          You can find your API key in the OpenAI dashboard.
        </p>
      </div>
      <Button
        onClick={() => {
          const apiKey = apiKeyRef.current?.value;
          if (!apiKey) {
            toast.error('API key is required');
            return;
          }
          config.save('key', apiKey).then(() => {
            toast.success('API key saved');
          });
        }}
      >
        Save
      </Button>
    </div>
  );
}

export default SettingsPage;
