import { PlusIcon } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

import { Button, Label, ResponsiveDialog } from '@botmate/ui';
import { Input } from '@botmate/ui';
import type { InlineKeyboardButton } from 'grammy/types';

type Props = {
  defaultButton?: InlineKeyboardButton.UrlButton[][];
  onChange?: (button: InlineKeyboardButton.UrlButton[][]) => void;
};
function KeyboardBuilder({ defaultButton, onChange }: Props) {
  const [modal, setModal] = useState(false);
  const [button, setButton] = useState<InlineKeyboardButton.UrlButton[][]>(
    defaultButton ?? [],
  );
  const [selectedRow, setSelectedRow] = useState<number | null>(null);

  const textRef = useRef<HTMLInputElement>(null);
  const urlRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (onChange) {
      onChange(button);
    }
  }, [button]);

  return (
    <div className="space-y-1">
      {button.map((row, i) => (
        <div key={i} className="flex space-x-2">
          {row.map((btn, j) => (
            <Button
              key={`${i}-${j}`}
              size="sm"
              onClick={() => {
                setModal(true);
                setSelectedRow(i);
              }}
            >
              {btn.text}
            </Button>
          ))}

          <Button
            key={i}
            size="sm"
            onClick={() => {
              setSelectedRow(i);
              setModal(true);
            }}
            variant="outline"
          >
            <PlusIcon size={14} />
          </Button>
        </div>
      ))}

      <div>
        <Button
          size="sm"
          // disabled={button[button.length - 1]?.length === 0}
          onClick={() => {
            setButton([...button, []]);
          }}
          variant="outline"
        >
          <PlusIcon size={14} /> Row
        </Button>

        <Button
          variant="link"
          className="text-sm text-muted-foreground mt-1"
          onClick={() => {
            const cnf = confirm('Are you sure you want to clear the keyboard?');
            if (cnf) {
              setButton([]);
            }
          }}
        >
          Clear
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">
        Build a custom inline keyboard for your message.
      </p>

      <ResponsiveDialog
        open={modal}
        onClose={() => setModal(false)}
        title="Add Button"
        className="space-y-4"
      >
        <div>
          <Label htmlFor="button-text">Text</Label>
          <Input id="button-text" placeholder="Website" ref={textRef} />
        </div>
        <div>
          <Label htmlFor="button-url">URL</Label>
          <Input
            id="button-url"
            placeholder="https://example.com"
            ref={urlRef}
          />
          <p className="text-sm text-muted-foreground mt-1">
            Leave blank for text buttons
          </p>
        </div>
        <Button
          onClick={() => {
            if (textRef.current && urlRef.current) {
              const text = textRef.current.value;
              const url = urlRef.current.value;
              if (selectedRow !== null) {
                const newRow = [...button[selectedRow]];
                newRow.push({ text, url });
                const newButton = [...button];
                newButton[selectedRow] = newRow;
                setButton(newButton);
              }
            }
            setModal(false);
          }}
        >
          Submit
        </Button>
      </ResponsiveDialog>
    </div>
  );
}

export default KeyboardBuilder;
