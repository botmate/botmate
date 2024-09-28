import { Edit, SaveIcon, Share2, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useForm } from 'react-hook-form';
import { Link, useSearchParams } from 'react-router-dom';

import { WorkflowEvent } from '@botmate/platform';
import {
  Button,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@botmate/ui';
import { toast } from 'sonner';

import WorkflowArea from '../../../components/workflows/area';
import WorkflowSidebar from '../../../components/workflows/sidebar';
import { useCurrentBot } from '../../../hooks/bots';
import { useBotWorkflows, useWorkflowEvents } from '../../../hooks/workflows';
import { SidebarItem, SidebarLayout } from '../../../layouts/sidebar';
import { trpc } from '../../../trpc';

function WorkflowsPage() {
  const form = useForm();
  const bot = useCurrentBot();
  const workflows = useBotWorkflows();
  const [searchParam] = useSearchParams();
  const createWorkflow = trpc.createWorkflow.useMutation();
  const [selectedEvent, setSelectedEvent] = useState<WorkflowEvent | null>(
    null,
  );
  const events = useWorkflowEvents();
  const wfId = searchParam.get('id');

  const items = useMemo(() => {
    const _items = [
      <h1 className={`text-gray-600 dark:text-neutral-500 text-sm uppercase`}>
        Your Workflows
      </h1>,

      ...(workflows.data.map((workflow) => (
        <Link
          key={workflow._id}
          to={`/bots/${bot._id}/workflows?id=${workflow._id}`}
        >
          <SidebarItem
            title={workflow.name}
            description={`Last run 4 days ago`}
            active={wfId === workflow._id}
          />
        </Link>
      )) || []),
    ];

    return _items;
  }, [workflows, bot.id, wfId]);

  useEffect(() => {
    if (wfId) {
      const workflow = workflows.data.find((wf) => wf._id === wfId);
      if (workflow) {
        form.setValue('name', workflow.name);
        form.setValue('event', workflow.event);
        form.setValue('steps', workflow.steps);
        form.setValue('values', workflow.values);

        const event = events.find((event) => event.id === workflow.event);
        setSelectedEvent(event || null);
      }
    }
  }, [workflows, wfId]);

  function handleSubmit(data: Record<string, any>) {
    createWorkflow
      .mutateAsync({
        name: `${Math.random().toString(36).substring(7).toUpperCase()}`,
        botId: bot.id,
        steps: data.steps,
        values: data.values,
        enabled: true,
        event: data.event,
      })
      .then(() => {
        toast.success('Workflow created');
      });
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="flex-1">
      <SidebarLayout
        actions={
          <div className="flex">
            <Button variant="ghost" tooltip="Save" type="submit">
              <SaveIcon size={18} />
            </Button>
            <Button variant="ghost" tooltip="Delete">
              <Trash2 size={18} />
            </Button>
            <Button variant="ghost" tooltip="Edit">
              <Edit size={18} />
            </Button>
            <Button variant="ghost" tooltip="Share">
              <Share2 size={18} />
            </Button>
          </div>
        }
        items={items}
        title={'Workflows'}
      >
        <DndProvider backend={HTML5Backend}>
          <div className="flex h-full">
            <div className="flex-1 flex flex-col overflow-auto">
              <div className="flex items-center justify-between px-4 border-b">
                <h1 className="h-16 font-medium flex items-center">
                  My workflow
                </h1>
                <div className="h-16 flex items-center">
                  <Select
                    value={selectedEvent?.id}
                    onValueChange={(id) => {
                      const event = events.find((event) => event.id === id);
                      setSelectedEvent(event || null);
                      form.setValue('event', id);
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
                            {event.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex-1">
                <WorkflowArea form={form} />
              </div>
            </div>
            <div className="w-[26rem] border-l overflow-auto">
              <WorkflowSidebar event={selectedEvent} />
            </div>
          </div>
        </DndProvider>
      </SidebarLayout>
    </form>
  );
}

export default WorkflowsPage;
