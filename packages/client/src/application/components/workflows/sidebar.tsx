import { useState } from 'react';

import { WorkflowAction, WorkflowEvent } from '@botmate/platform';

import WorkflowActions from './actionts';
import WorkflowEventEditor from './events';

const tabs = ['Actions', 'Help'] as const;

type Props = {
  event?: WorkflowEvent | null;
  action?: WorkflowAction | null;
};
function WorkflowSidebar({ event, action }: Props) {
  const [tab, setTab] = useState<(typeof tabs)[number]>(tabs[0]);

  return (
    <div>
      <div className="border-b border-muted">
        <nav className="flex gap-4 px-4" aria-label="Tabs">
          {tabs.map((_tab) => (
            <button
              key={_tab}
              onClick={() => setTab(_tab)}
              className={`px-1 h-16 text-sm font-medium transition-all
            ${
              _tab === tab
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:text-muted-foreground/70 border-b-2 border-transparent'
            }`}
            >
              {_tab}
            </button>
          ))}
        </nav>
      </div>
      <div className="p-4">
        {event ? tab === 'Actions' ? <WorkflowActions /> : null : null}
      </div>
    </div>
  );
}

// function WorkflowEvents() {
//   const [selected, setSelected] = useState<string | null>(null);
//   const { data } = trpc.getWorkflowEvents.useQuery('telegram');
//   const events = useMemo(() => {
//     return Object.entries(data || {}).map(([key, value]) => ({
//       id: key,
//       ...value,
//     }));
//   }, [data]);
//   return (
//     <ul className="flex flex-col">
//       <p className="text-muted-foreground text-xs pb-4 pt-2">
//         Please select which event should trigger this workflow.
//       </p>
//       {events.map((event) => (
//         <li
//           key={event.id}
//           className="p-4 hover:bg-muted/30 flex items-center gap-4 select-none"
//           onClick={() => setSelected(event.id)}
//         >
//           <CheckIcon
//             className="w-4 h-4"
//             opacity={selected === event.id ? 1 : 0}
//           />
//           <div>
//             <h1> {event.name}</h1>
//             <p className="text-muted-foreground text-sm">{event.description}</p>
//           </div>
//         </li>
//       ))}
//     </ul>
//   );
// }

// function WorkflowActions() {
//   return null;
//   // const { data } = trpc.getWorkflowActions.useQuery('telegram');
//   // const actions = useMemo(() => {
//   //   return Object.entries(data || {}).map(([key, value]) => ({
//   //     id: key,
//   //     name: value.name,
//   //   }));
//   // }, [data]);
//   // return (
//   //   <ul className="flex flex-col">
//   //     {actions.map((action) => (
//   //       <li key={action.id} className="p-4">
//   //         {action.name}
//   //       </li>
//   //     ))}
//   //   </ul>
//   // );
// }

export default WorkflowSidebar;
