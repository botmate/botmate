import { Edit, Share2, Trash2 } from 'lucide-react';
import { useMemo } from 'react';

import { Button } from '@botmate/ui';

import WorkflowArea from '../../../components/workflows/area';
import { SidebarLayout } from '../../../layouts/sidebar';

function WorkflowsPage() {
  const items = useMemo(() => {
    const _items = [
      <h1 className={`text-gray-600 dark:text-neutral-500 text-sm uppercase`}>
        Your Workflows
      </h1>,
    ];

    return _items;
  }, []);
  return (
    <SidebarLayout
      actions={
        <div className="flex">
          {/* <Button variant="outline">
          <PlusIcon size={18} />
          New Workflow
        </Button> */}
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
      title="Workflows"
    >
      <WorkflowArea />
    </SidebarLayout>
  );
}

export default WorkflowsPage;
