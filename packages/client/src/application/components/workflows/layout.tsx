import { useState } from 'react';

import { WorkflowEvent } from '@botmate/platform';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@botmate/ui';

import WorkflowArea from './area';
import WorkflowSidebar from './sidebar';
import { useWorkflowEvents } from './workflow';

function WorkflowLayout() {
  const events = useWorkflowEvents();

  const [selectedEvent, setSelectedEvent] = useState<WorkflowEvent | null>(
    null,
  );

  return (
    <div className="flex h-full">
      <div className="flex-1 flex flex-col overflow-auto">
        <div className="flex items-center justify-between px-4 border-b">
          <h1 className="h-16 font-medium flex items-center" contentEditable>
            My workflow
          </h1>
          <div className="h-16 flex items-center">
            <Select
              onValueChange={(id) => {
                const event = events.find((event) => event.id === id);
                setSelectedEvent(event || null);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select an event" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Events</SelectLabel>
                  {events.map((event) => (
                    <SelectItem key={event.id} value={event.id}>
                      {event.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex-1">
          <WorkflowArea />
        </div>
      </div>
      <div className="w-[26rem] border-l overflow-auto">
        <WorkflowSidebar event={selectedEvent} />
      </div>
    </div>
  );
}

export default WorkflowLayout;
