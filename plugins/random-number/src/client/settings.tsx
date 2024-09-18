import React, { useEffect, useState } from 'react';

import { toast, usePluginConfig } from '@botmate/client';
import { Button, Input, Section } from '@botmate/ui';

import { Config } from '../config.types';

function SettingsPage() {
  const config = usePluginConfig<Config>();

  const [min, setMin] = useState(0);
  const [max, setMax] = useState(100);

  useEffect(() => {
    const min = config.get('min', 0);
    const max = config.get('max', 100);

    setMin(min);
    setMax(max);
  }, [config]);

  return (
    <div className="max-w-2xl">
      <Section
        title="Random Number Generator"
        description="Set the minimum and maximum range for the random number generator."
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 space-y-1">
            <label htmlFor="min">Min</label>
            <Input
              id="min"
              type="number"
              placeholder="0"
              value={min}
              onChange={(e) => {
                if (e.target.value === '') {
                  setMin(0);
                  return;
                }
                setMin(parseFloat(e.target.value));
              }}
            />
          </div>
          <div className="flex-1 space-y-1">
            <label htmlFor="max">Max</label>
            <Input
              id="max"
              type="number"
              placeholder="100"
              value={max}
              onChange={(e) => {
                if (e.target.value === '') {
                  return;
                }
                setMax(parseFloat(e.target.value));
              }}
            />
          </div>
        </div>

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
      </Section>
    </div>
  );
}

export default SettingsPage;
