import React from 'react';

import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Label,
  PageLayout,
  RadioGroup,
  RadioGroupItem,
  Section,
} from '@botmate/ui';

import { CommonFilters, ServiceMessage } from '../../constants';

function FiltersPage() {
  return (
    <PageLayout title="Filters">
      <div className="space-y-8">
        <Section
          title="Common Filters"
          description="Filter common messages in the group"
        >
          <div className="space-y-2">
            {CommonFilters.map((filter) => (
              <div
                key={filter.key}
                className="flex justify-between items-center border-b"
              >
                <h2 className="font-medium">{filter.label}</h2>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="link"
                      className="dark:text-white text-black"
                    >
                      Allow all
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader className="border-b pb-4">
                      <DialogTitle>{filter.label}</DialogTitle>
                      <DialogDescription></DialogDescription>
                    </DialogHeader>

                    <div className="w-full space-y-6 py-4">
                      {filter.inputs.build()}
                    </div>
                    <DialogFooter>
                      <Button variant="ghost">Cancel</Button>
                      <Button>Save</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            ))}
          </div>
          <Button>Save</Button>
        </Section>

        <Section
          title="Service Messages"
          description="Filter service messages in the group"
        >
          <div className="space-y-4">
            {ServiceMessage.map((filter) => (
              <div className="flex items-center space-x-2" key={filter.key}>
                <Checkbox
                  id={filter.key}
                  // checked={config.get('allow_alld')}
                  onCheckedChange={(checked) => {
                    // config.save('allow_alld', Boolean(checked));
                  }}
                />
                <label
                  htmlFor={filter.key}
                  className="text-sm leading-none peer-delete_alld:cursor-not-allowed peer-delete_alld:opacity-70"
                >
                  {filter.label}
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

export default FiltersPage;
