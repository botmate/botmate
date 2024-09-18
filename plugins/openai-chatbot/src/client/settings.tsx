import React, { useRef } from 'react';

import { toast, usePluginConfig } from '@botmate/client';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Section,
} from '@botmate/ui';

import { Config } from '../config.types';

function SettingsPage() {
  const config = usePluginConfig<Config>();

  const apiKeyRef = useRef<HTMLInputElement>(null);
  const defaultValue = config.get('key', '');

  return (
    <div className="max-w-xl">
      <Section
        title="OpenAI API"
        description="Set your OpenAI API key to enable the chatbot plugin."
      >
        <Input
          placeholder="Enter your OpenAI API key (eg. sk-....P20J)"
          ref={apiKeyRef}
          defaultValue={defaultValue}
        />
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
      </Section>
    </div>
  );

  return (
    <div className="max-w-xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-md">OpenAI API</CardTitle>
          <CardDescription className="text-sm">
            Set your OpenAI API key to enable the chatbot plugin.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between gap-4">
          <div className="flex-1 space-y-1">
            <label htmlFor="key">API Key</label>
            <Input
              id="key"
              type="password"
              placeholder="sk-....P20J"
              ref={apiKeyRef}
              defaultValue={defaultValue}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={async () => {
              const apiKey = apiKeyRef.current?.value;
              if (!apiKey) {
                toast.error('API key is required');
                return;
              }
              await config.save('key', apiKey);
              toast.success('API key saved');
            }}
          >
            Save
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default SettingsPage;
