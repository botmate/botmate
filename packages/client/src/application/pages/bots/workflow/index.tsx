import { Edit, SaveIcon, Share2, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

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
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const createWorkflow = trpc.createWorkflow.useMutation();
  const updateWorkflow = trpc.updateWorkflow.useMutation();
  const deleteWorkflow = trpc.deleteWorkflow.useMutation();

  const [selectedEvent, setSelectedEvent] = useState<WorkflowEvent | null>(
    null,
  );
  const events = useWorkflowEvents();
  const wfId = searchParams.get('id');
  const [isEditing, setIsEditing] = useState(false);

  // Memoized list of workflow items
  const items = useMemo(() => {
    return [
      <h1
        key="title"
        className="text-gray-600 dark:text-neutral-500 text-sm uppercase"
      >
        Your Workflows
      </h1>,
      ...(workflows.data?.map((workflow) => (
        <Link
          key={workflow._id}
          to={`/bots/${bot._id}/workflows?id=${workflow._id}`}
        >
          <SidebarItem
            title={workflow.name}
            description="Last run 4 days ago"
            active={wfId === workflow._id}
          />
        </Link>
      )) || []),
    ];
  }, [workflows.data, bot._id, wfId]);

  // Reset form and event selection based on the workflow ID
  useEffect(() => {
    if (wfId) {
      const workflow = workflows.data?.find((wf) => wf._id === wfId);
      if (workflow) {
        form.reset({
          name: workflow.name,
          event: workflow.event,
          steps: workflow.steps,
          values: workflow.values,
        });
        const event = events.find((event) => event.id === workflow.event);
        setSelectedEvent(event || null);
      }
    } else {
      form.reset();
      setSelectedEvent(null);
    }
    setIsEditing(false);
  }, [wfId, workflows.data, events, form]);

  // Handle submit for creating or updating workflows
  const handleSubmit = useCallback(
    async (data: Record<string, any>) => {
      if (!selectedEvent) return;

      const mutation = wfId ? updateWorkflow : createWorkflow;
      const mutationData = {
        _id: wfId || undefined,
        name: data.name,
        botId: bot._id,
        steps: data.steps,
        values: data.values,
        enabled: true,
        event: selectedEvent?.id,
      };

      try {
        // @ts-expect-error
        await mutation.mutateAsync(mutationData);
        toast.success(`Workflow ${wfId ? 'updated' : 'created'}`);
        setIsEditing(false);
      } catch (error) {
        toast.error(`Failed to ${wfId ? 'update' : 'create'} workflow`);
      }
    },
    [bot._id, wfId, selectedEvent, updateWorkflow, createWorkflow, navigate],
  );

  // Handle workflow deletion
  const handleDelete = useCallback(async () => {
    if (wfId) {
      try {
        await deleteWorkflow.mutateAsync(wfId);
        toast.success('Workflow deleted');
        navigate(`/bots/${bot._id}/workflows`);
      } catch (error) {
        toast.error('Failed to delete workflow');
      }
    }
  }, [deleteWorkflow, wfId, bot._id, navigate]);

  return (
    <div className="flex-1">
      <SidebarLayout
        actions={
          <div className="flex">
            {isEditing ? (
              <>
                <Button
                  variant="ghost"
                  tooltip="Save"
                  onClick={form.handleSubmit(handleSubmit)}
                >
                  <SaveIcon size={18} />
                </Button>
                <Button
                  variant="ghost"
                  tooltip="Cancel"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  tooltip="Edit"
                  onClick={() => setIsEditing(true)}
                  type="button"
                >
                  <Edit size={18} />
                </Button>
                <Button variant="ghost" tooltip="Delete" onClick={handleDelete}>
                  <Trash2 size={18} />
                </Button>
                <Button variant="ghost" tooltip="Share">
                  <Share2 size={18} />
                </Button>
              </>
            )}
          </div>
        }
        items={items}
        title="Workflows"
      >
        <DndProvider backend={HTML5Backend}>
          <div className="flex h-full">
            <div className="flex-1 flex flex-col overflow-auto">
              <div className="flex items-center justify-between px-4 border-b">
                <h1 className="h-16 font-medium flex items-center">
                  {isEditing ? (
                    <input
                      {...form.register('name')}
                      className="border-none bg-transparent font-medium"
                      placeholder="Workflow name"
                    />
                  ) : (
                    form.watch('name') || 'My workflow'
                  )}
                </h1>
                <div className="h-16 flex items-center">
                  <Select
                    value={selectedEvent?.id}
                    onValueChange={(id) => {
                      const event = events.find((event) => event.id === id);
                      setSelectedEvent(event || null);
                      form.setValue('event', id);
                    }}
                    disabled={!isEditing}
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
    </div>
  );
}

export default WorkflowsPage;
