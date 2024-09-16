import React, { useEffect, useState } from 'react';

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

  const [min, setMin] = useState('0');
  const [max, setMax] = useState('100');

  useEffect(() => {
    const storedMin = config.get<number>('min', 0);
    const storedMax = config.get<number>('max', 100);

    setMin(storedMin.toString());
    setMax(storedMax.toString());
  }, [config]);

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
            <Input
              id="min"
              type="number"
              placeholder="0"
              value={min}
              onChange={(e) => setMin(e.target.value)}
            />
          </div>
          <div className="flex-1 space-y-1">
            <label htmlFor="max">Max</label>
            <Input
              id="max"
              type="number"
              placeholder="100"
              value={max}
              onChange={(e) => setMax(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={async () => {
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
