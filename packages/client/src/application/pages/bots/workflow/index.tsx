// import { ReactFlowProvider } from '@xyflow/react';
// import { PlusIcon } from 'lucide-react';
// import React, { useMemo } from 'react';
// import { useParams } from 'react-router-dom';

// import { Button } from '@botmate/ui';

// import WorkflowArea from '../../../components/workflows/area';
// import { SidebarLayout } from '../../../layouts/sidebar';

// function WorkflowsPage() {
//   const params = useParams();

//   const items = useMemo(() => {
//     const _items = [
//       'Your Workflows',
//       {
//         title: 'Start',
//         description: 'Handle the /start command',
//         path: `/bots/${params.botId}/workflows?id=start`,
//         regex: /^\/bots\/\d+\/workflows\?id=start/,
//       },
//     ];

//     return _items;
//   }, []);
//   return (
//     <SidebarLayout
//       actions={
//         <Button>
//           <PlusIcon className="w-4 h-4" />
//           New Workflow
//         </Button>
//       }
//       items={items}
//       title="Workflows"
//     >
//       <ReactFlowProvider>
//         <WorkflowArea />
//       </ReactFlowProvider>
//     </SidebarLayout>
//   );
// }

// export default WorkflowsPage;
