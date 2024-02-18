'use client';

function CommandEntry() {
  return <></>;
}

export default CommandEntry;

// import { useCommandStore } from '#store/command';
// import { ActionValue, ConditionValue } from '#types';
// import { Button } from '#ui/button';
// import { Card, CardContent, CardHeader } from '#ui/card';
// import { Input } from '#ui/input';
// import { Label } from '#ui/label';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '#ui/select';
// import { Textarea } from '#ui/textarea';
// import { Command } from '@prisma/client';
// import { AnimatePresence, motion } from 'framer-motion';
// import React, { useEffect, useMemo, useState } from 'react';
// import { HiOutlinePlus } from 'react-icons/hi';

// import NoData from '#components/no-data';

// import { actionList, conditionList } from './data';

// // todo: add zod validation
// // todo: better error handling
// // todo: better typings

// type Props = {
//   command?: Command;
// };
// function CommandEntry({ command }: Props) {
//   // Store
//   const setCommandValues = useCommandStore((s) => s.setCommandValues);

//   const activeCommandCondition = useMemo(() => {
//     if (command) {
//       // @ts-expect-error
//       return conditionList.find((c) => c.id === command.condition.id);
//     }
//     return conditionList[0];
//   }, [command]);

//   // Local State
//   // todo: use conditionList
//   const [condition, setCondition] = useState(activeCommandCondition!);
//   const [alias, setAlias] = useState<string>('');
//   const [actions, setActions] = useState<ActionValue[]>([]);
//   const [conditionValue, setConditionValue] = useState<ConditionValue>({
//     id: condition?.id || '',
//     value: '',
//   });
//   const [actionPicker, setActionPicker] = useState(false);

//   useEffect(() => {
//     setCommandValues({
//       alias,
//       actions,
//       condition: conditionValue,
//     });
//     if (command) {
//       // @ts-expect-error
//       setActions(command?.actions || []);
//     }
//   }, [actions, alias, command, conditionValue, setCommandValues]);

//   return (
//     <div className="p-4 space-y-4">
//       <div>
//         <Label>Alias</Label>
//         <Input
//           value={command?.alias || alias}
//           className="mt-2 shadow-sm"
//           placeholder="Enter command alias"
//           onChange={(e) => {
//             setAlias(e.target.value);
//           }}
//         />
//       </div>
//       <div className="space-y-2">
//         <Label>Condition Type</Label>

//         <Select
//           onValueChange={(val) => {
//             const condition = conditionList.find((c) => c.id === val);
//             if (condition) {
//               setCondition(condition);
//               setConditionValue({
//                 id: condition.id,
//                 value: {},
//               });
//             }
//           }}
//           defaultValue={condition.id}
//         >
//           <SelectTrigger className="shadow-sm">
//             <SelectValue placeholder="Select condition" />
//           </SelectTrigger>
//           <SelectContent>
//             {conditionList.map((condition) => (
//               <SelectItem key={condition.id} value={condition.id}>
//                 {condition.title}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>

//         <p className="text-sm text-gray-500">{condition.description}</p>

//         <div className="space-x-2">
//           {condition.inputs.map((field) => {
//             return (
//               <div key={field.id} className="mb-4">
//                 <Label htmlFor={field.id}>{field.label}</Label>
//                 <Textarea
//                   className="mt-2 resize-none shadow-sm"
//                   id={field.id}
//                   placeholder={field.placeholder}
//                   value={
//                     // @ts-expect-error
//                     command?.condition.value[field.id] ||
//                     conditionValue.value[field.id]
//                   }
//                   onChange={(e) => {
//                     setConditionValue((prev) => ({
//                       id: prev.id,
//                       value: {
//                         ...prev.value,
//                         [field.id]: e.target.value,
//                       },
//                     }));
//                   }}
//                 />
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       <div className="space-y-2">
//         <div className="flex flex-row items-center justify-between">
//           <h1 className="font-semibold">Actions</h1>
//         </div>
//         {actionPicker ? (
//           <ActionBuilder
//             actions={actionList}
//             onCancel={() => {
//               setActionPicker(false);
//             }}
//             onAdd={(action) => {
//               setActions((prev) => [...prev, action]);
//               setActionPicker(false);
//             }}
//           />
//         ) : actions.length === 0 ? (
//           <NoData title="No actions" />
//         ) : (
//           <div className="space-y-2">
//             <AnimatePresence>
//               {actions.map((action, index) => {
//                 const actionData = actionList.find((a) => a.id === action.id);
//                 if (!actionData) return null;

//                 return (
//                   <motion.div
//                     key={index}
//                     layout
//                     initial={{ opacity: 0, y: 10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: 10 }}
//                     transition={{
//                       delay: 0.05 * index,
//                     }}
//                   >
//                     <Card>
//                       <CardHeader className="flex-row items-center justify-between">
//                         <div>
//                           <h1>{actionData.title}</h1>
//                           <p className="text-sm text-gray-500">
//                             {action.value[actionData.displayFields[0]]}
//                           </p>
//                         </div>
//                         <Button
//                           size="sm"
//                           variant="destructive"
//                           onClick={() => {
//                             setActions((prev) => {
//                               const copy = [...prev];
//                               copy.splice(index, 1);
//                               return copy;
//                             });
//                           }}
//                         >
//                           Remove
//                         </Button>
//                       </CardHeader>
//                     </Card>
//                   </motion.div>
//                 );
//               })}
//             </AnimatePresence>
//           </div>
//         )}
//         <Button
//           className="w-full"
//           size="sm"
//           onClick={() => setActionPicker(true)}
//           icon={<HiOutlinePlus />}
//         >
//           Action
//         </Button>
//       </div>
//     </div>
//   );
// }

// export default CommandEntry;

// // todo: better typings
// type Action = (typeof actionList)[0];
// function ActionBuilder({
//   actions,
//   onCancel,
//   onAdd,
// }: {
//   actions: Action[];
//   onCancel: () => void;
//   onAdd: (action: ActionValue) => void;
//   defaultActions?: ActionValue[];
// }) {
//   const [selectedAction, setSelectedAction] = useState<Action | null>(
//     actions[0],
//   );
//   const [value, setValues] = useState<Record<string, string>>({});

//   return (
//     <div className="flex items-center flex-wrap break-words">
//       {actions.map((action) => {
//         return (
//           <div
//             key={action.id}
//             className={`text-center px-3 py-2 select-none rounded-md border ${
//               selectedAction?.id === action.id
//                 ? 'bg-neutral-50'
//                 : 'border-transparent'
//             }`}
//             onClick={() => {
//               setSelectedAction(action);
//             }}
//           >
//             <h1 className="text-xs">{action.title}</h1>
//           </div>
//         );
//       })}

//       {selectedAction && (
//         <div className="mt-4 w-full">
//           {selectedAction.inputs.map((field) => {
//             return (
//               <div key={field.id} className="mb-4">
//                 <Label htmlFor={field.id}>{field.label}</Label>
//                 <Input
//                   id={field.id}
//                   className="mt-2 shadow-sm"
//                   placeholder={field.placeholder}
//                   onChange={(e) => {
//                     setValues((prev) => ({
//                       ...prev,
//                       [field.id]: e.target.value,
//                     }));
//                   }}
//                 />
//               </div>
//             );
//           })}
//         </div>
//       )}

//       <div className="flex gap-2">
//         <Button
//           size="sm"
//           onClick={() => {
//             if (selectedAction) {
//               onAdd({
//                 id: selectedAction.id,
//                 value,
//               });
//             }
//           }}
//         >
//           Add
//         </Button>
//         <Button size="sm" variant="outline" onClick={onCancel}>
//           Cancel
//         </Button>
//       </div>
//     </div>
//   );
// }
