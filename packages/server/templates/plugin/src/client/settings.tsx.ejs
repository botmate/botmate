import React from 'react';

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

  const minRef = React.useRef<HTMLInputElement>(null);
  const maxRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const min = config.get('min', '0');
    const max = config.get('max', '100');

    minRef.current!.value = min;
    maxRef.current!.value = max;
  }, []);

  return (
    <div className="max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-md">Configure Range</CardTitle>
          <CardDescription className="text-sm">
            Set the minimum and maximum range for the random number generator.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between gap-4">
          <div className="flex-1 space-y-1">
            <label htmlFor="min">Min</label>
            <Input id="min" type="number" placeholder="0" ref={minRef} />
          </div>
          <div className="flex-1 space-y-1">
            <label htmlFor="max">Max</label>
            <Input id="max" type="number" placeholder="100" ref={maxRef} />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={async () => {
              const min = minRef.current?.value;
              const max = maxRef.current?.value;

              if (min && max) {
                await config.save('min', min);
                await config.save('max', max);

                toast.success('Range saved');
              } else {
                toast.error('Please enter a valid number');
              }
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
