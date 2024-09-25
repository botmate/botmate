import React, { useRef } from 'react';

import { toast, usePluginConfig } from '@botmate/client';
import { Button, Input } from '@botmate/ui';

import { Config } from '../config.types';

function SettingsPage() {
  const config = usePluginConfig<Config>();

  const minRef = useRef<HTMLInputElement>(null);
  const maxRef = useRef<HTMLInputElement>(null);

  const minDefault = config.get('min', 0);
  const maxDefault = config.get('max', 100);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 space-y-1">
          <label htmlFor="min">Min</label>
          <Input
            id="min"
            type="number"
            placeholder="0"
            defaultValue={minDefault}
            ref={minRef}
          />
        </div>
        <div className="flex-1 space-y-1">
          <label htmlFor="max">Max</label>
          <Input
            id="max"
            type="number"
            placeholder="100"
            defaultValue={maxDefault}
            ref={maxRef}
          />
        </div>
      </div>

      <Button
        onClick={async () => {
          const min = minRef.current?.value;
          const max = maxRef.current?.value;

          if (min && max) {
            await config.save('min', parseFloat(min));
            await config.save('max', parseFloat(max));

            toast.success('Range saved');
          } else {
            toast.error('Please enter a valid number');
          }
        }}
        isLoading={config.isSaving}
      >
        Save
      </Button>
    </div>
  );
}

export default SettingsPage;
