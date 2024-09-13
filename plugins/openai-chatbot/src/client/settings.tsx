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
} from '@botmate/ui';

function SettingsPage() {
  const config = usePluginConfig();

  const apiKeyRef = useRef<HTMLInputElement>(null);
  const defaultValue = config.get('openai.apiKey', '');

  return (
    <div className="max-w-xl p-8">
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

              await config.save('openai.apiKey', apiKey);
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
