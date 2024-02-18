// 'use client';
import prisma from '#prisma';

import CommandList from '#components/command/list';

type Props = {
  children: React.ReactNode;
  params: {
    id: string;
  };
};
async function Layout({ params, children }: Props) {
  const { id: botId } = params;

  const commands = await prisma.command.findMany({
    where: {
      botId,
    },
  });

  return (
    <div className="flex h-full">
      <CommandList commands={commands} />
      <div className="flex-1">{children}</div>
    </div>
  );
}

export default Layout;

// import { trpc } from '#lib/trpc/client';
// import { useCommandStore } from '#store/command';
// import { Button } from '#ui/button';
// import { Card } from '#ui/card';
// import { Skeleton } from '#ui/skeleton';
// import React, { useEffect, useState } from 'react';
// import { HiOutlinePlus } from 'react-icons/hi';
// import { toast } from 'sonner';

// import Link from 'next/link';

// import CommandEntry from '#components/command/entry';
// import PageLayout from '#components/layouts/page';

// type Props = {
//   children: React.ReactNode;
//   params: {
//     id: string;
//     cmdId: string;
//   };
// };
// function Page({ params, children }: Props) {
//   const botId = params.id;
//   const cmdId = params.cmdId;

//   // Queries/Mutations
//   const createCommand = trpc.createCommand.useMutation();
//   const commandsQuery = trpc.getCommands.useQuery({
//     botId,
//   });

//   // Store
//   const {
//     commands,
//     setCommands,
//     activeCommand,
//     commandValues,
//     setActiveCommand,
//   } = useCommandStore();

//   // Local state
//   const [newCommand, setNewCommand] = useState(false);

//   useEffect(() => {
//     // Update the store with the commands
//     if (commandsQuery.data) {
//       // @ts-expect-error
//       setCommands(commandsQuery.data);
//     }
//   }, [commandsQuery.data, setCommands]);

//   if (commandsQuery.isLoading) {
//     return (
//       <PageLayout title="Commands">
//         <div className="w-80 space-y-2 h-full p-2 border-r">
//           {new Array(10).fill(null).map((_, index) => (
//             <Skeleton key={index} className="h-20" />
//           ))}
//         </div>
//       </PageLayout>
//     );
//   }

//   return (
//     <PageLayout
//       title="Commands"
//       actions={
//         newCommand ? (
//           <>
//             <Button
//               variant={'ghost'}
//               onClick={() => {
//                 setNewCommand(false);
//                 setActiveCommand(null);
//               }}
//             >
//               Cancel
//             </Button>
//             <Button
//               isLoading={createCommand.isLoading}
//               onClick={() => {
//                 const { alias, actions, condition } = commandValues;

//                 if (!alias || !actions?.length || !condition) {
//                   toast.error('Please fill in all fields');
//                   return;
//                 }

//                 createCommand
//                   .mutateAsync({
//                     alias,
//                     botId,
//                     actions,
//                     condition,
//                   })
//                   .then(() => {
//                     commandsQuery.refetch();
//                     setNewCommand(false);
//                     toast.success('Command created');
//                   });
//               }}
//             >
//               Save
//             </Button>
//           </>
//         ) : (
//           <Button
//             icon={<HiOutlinePlus />}
//             onClick={() => {
//               setNewCommand(true);
//               setActiveCommand(null);
//             }}
//           >
//             Command
//           </Button>
//         )
//       }
//     >
//       <div className="flex h-full">
//         <div className="w-80 overflow-auto p-2 space-y-2 border-r">
//           {newCommand && (
//             <Card className={`p-4 ${activeCommand ? 'bg-muted' : ''}`}>
//               <h1 className="font-semibold">New Command</h1>
//             </Card>
//           )}

//           {commands.map((cmd) => {
//             const active = activeCommand?.id === cmd.id;
//             return (
//               <div key={cmd.id}>
//                 <Link
//                   href={`/bots/${botId}/commands/${cmd.id}`}
//                   className="cursor-default"
//                 >
//                   <Card className={`p-4 ${active ? 'bg-muted' : ''}`}>
//                     <h1 className="font-semibold text-sm">{cmd.alias}</h1>
//                     <div className="flex mt-2">
//                       <div className="px-2 text-xs bg-primary text-primary-foreground rounded-sm">
//                         {/* @ts-ignore */}
//                         {cmd.actions?.length} actions
//                       </div>
//                     </div>
//                   </Card>
//                 </Link>
//               </div>
//             );
//           })}
//         </div>
//         {newCommand ? (
//           <div className="flex-1 h-full overflow-auto">
//             <CommandEntry />
//           </div>
//         ) : (
//           <div className="flex-1 h-full overflow-auto">{children}</div>
//         )}
//       </div>
//     </PageLayout>
//   );
// }

// export default Page;
