'use client';

import { Button } from '#ui/button';
import { Card, CardContent, CardHeader } from '#ui/card';
import { Input } from '#ui/input';
import { Label } from '#ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#ui/select';
import { Textarea } from '#ui/textarea';
import React, { useState } from 'react';
import { HiOutlinePlus } from 'react-icons/hi';

import { useRouter } from 'next/navigation';

import NoData from '#components/no-data';

import { conditions } from './data';

// todo: add zod validation
// todo: better error handling
// todo: better typings

type Props = {};
function CreateWorkflow({}: Props) {
  const r = useRouter();
  const { conditionList, actionList } = conditions.telegram;
  const [selectedCondition, setSelectedCondition] = useState(conditionList[0]);
  const [actions, setActions] = useState<Record<string, string>[]>([]);
  const [actionPicker, setActionPicker] = useState(false);

  return (
    <div className="max-w-xl m-auto p-4 space-y-4">
      <Card>
        <CardHeader>
          <h1 className="text-xl font-semibold">Condition</h1>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select
            onValueChange={(val) => {
              const condition = conditionList.find((c) => c.id === val);
              if (condition) {
                setSelectedCondition(condition);
              }
            }}
            defaultValue={selectedCondition.id}
          >
            <SelectTrigger className="shadow-sm">
              <SelectValue placeholder="Select condition" />
            </SelectTrigger>
            <SelectContent>
              {conditionList.map((condition) => (
                <SelectItem key={condition.id} value={condition.id}>
                  {condition.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="space-x-2">
            {selectedCondition.inputs.map((field) => {
              return (
                <div key={field.id} className="mb-4">
                  <Label htmlFor={field.id}>{field.label}</Label>
                  <Textarea
                    className="mt-2 resize-none shadow-sm"
                    id={field.id}
                    placeholder={field.placeholder}
                  />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <h1 className="text-xl font-semibold">Actions</h1>
          <Button size="sm" onClick={() => setActionPicker(true)}>
            <HiOutlinePlus />
          </Button>
        </CardHeader>
        <CardContent>
          {/* todo: seperate logics */}
          {actionPicker ? (
            <ActionBuilder
              actions={actionList}
              onCancel={() => {
                setActionPicker(false);
              }}
              onAdd={(action) => {
                setActions((prev) => [...prev, action]);
                setActionPicker(false);
              }}
            />
          ) : actions.length === 0 ? (
            <NoData title="No actions" />
          ) : (
            <div className="space-y-2">
              {actions.map((action) => {
                const actionData = actionList.find((a) => a.id === action.id);
                if (!actionData) return null;

                return (
                  <Card key={action.id}>
                    <CardHeader className="flex-row items-center justify-between">
                      <div>
                        <h1>{actionData.title}</h1>
                        <p className="text-sm text-gray-500">
                          {action[actionData.displayFields[0]]}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          setActions((prev) =>
                            prev.filter((a) => a.id !== action.id),
                          );
                        }}
                      >
                        Remove
                      </Button>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-2 justify-end">
        <Button
          variant="outline"
          onClick={() => {
            r.back();
          }}
        >
          Cancel
        </Button>
        <Button>Submit</Button>
      </div>
    </div>
  );
}

export default CreateWorkflow;

type Action = (typeof conditions.telegram.actionList)[0];
function ActionBuilder({
  actions,
  onCancel,
  onAdd,
}: {
  actions: Action[];
  onCancel: () => void;
  onAdd: (action: { id: string; [key: string]: string }) => void;
}) {
  const [selectedAction, setSelectedAction] = useState<Action | null>(
    actions[0],
  );
  const [values, setValues] = useState<Record<string, string>>({});

  return (
    <div className="flex items-center flex-wrap break-words">
      {actions.map((action) => {
        return (
          <div
            key={action.id}
            className={`text-center px-3 py-2 select-none rounded-md border ${
              selectedAction?.id === action.id
                ? 'bg-neutral-50'
                : 'border-transparent'
            }`}
            onClick={() => {
              setSelectedAction(action);
            }}
          >
            <h1 className="text-xs">{action.title}</h1>
          </div>
        );
      })}

      {selectedAction && (
        <div className="mt-4 w-full">
          {selectedAction.inputs.map((field) => {
            return (
              <div key={field.id} className="mb-4">
                <Label htmlFor={field.id}>{field.label}</Label>
                <Input
                  className="mt-2 shadow-sm"
                  id={field.id}
                  placeholder={field.placeholder}
                  onChange={(e) => {
                    setValues((prev) => ({
                      ...prev,
                      [field.id]: e.target.value,
                    }));
                  }}
                />
              </div>
            );
          })}
        </div>
      )}

      <div className="flex gap-2">
        <Button
          size="sm"
          onClick={() => {
            if (selectedAction) {
              onAdd({
                id: selectedAction.id,
                ...values,
              });
            }
          }}
        >
          Add
        </Button>
        <Button size="sm" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
