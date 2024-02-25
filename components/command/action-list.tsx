import { ActionListItem } from '#types';
import { ArrowRight, PlusSquareIcon } from 'lucide-react';
import React from 'react';

import { actionList as list } from './data';

type Props = {
  onSelect: (action: ActionListItem) => void;
};
function ActionList({ onSelect }: Props) {
  return (
    <div className="space-y-4">
      {list.map((action, index) => (
        <div
          key={index}
          className={`flex items-center gap-2 text-sm rounded-md group`}
        >
          {action.icon ? (
            <div className="p-2 bg-primary text-primary-foreground rounded-md">
              <action.icon size={20} />
            </div>
          ) : null}
          <div>
            <h1>{action.name}</h1>
            <p className="text-xs text-muted-foreground">
              {action.description}
            </p>
          </div>

          <div className="flex-1" />
          <div className="opacity-0 group-hover:opacity-100">
            <PlusSquareIcon
              className="hover:cursor-pointer"
              onClick={() => {
                onSelect(action);
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default ActionList;
