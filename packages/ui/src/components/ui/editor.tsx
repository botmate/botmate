import {
  EditorContent,
  type Editor as IEditor,
  useEditor,
} from '@tiptap/react';
import { BoldIcon, CodeIcon } from 'lucide-react';

import Placeholder from '@tiptap/extension-placeholder';
import StarterKit from '@tiptap/starter-kit';

import { Toggle } from './toggle';

type ToolbarProps = {
  editor: IEditor | null;
};
function Toolbar({ editor }: ToolbarProps) {
  if (!editor) {
    return null;
  }
  return (
    <div className="rounded-md flex items-center gap-2 bg-transparent pb-1">
      <Toggle
        size="sm"
        pressed={editor.isActive('bold')}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
      >
        <BoldIcon className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        pressed={editor.isActive('codeBlock')}
        onPressedChange={() => editor.chain().focus().toggleCodeBlock().run()}
      >
        <CodeIcon className="h-4 w-4" />
      </Toggle>
    </div>
  );
}

export type EditorProps = {
  placeholder?: string;
  defaultValue?: string;
  onChange: (value: string) => void;
};

export function Editor({ defaultValue, placeholder, onChange }: EditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure(),
      Placeholder.configure({
        placeholder: placeholder ?? 'Write your message here',
      }),
    ],
    content: defaultValue,
    editorProps: {
      attributes: {
        class:
          'min-h-[150px] w-full resize-none rounded-md border border-input bg-card px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      },
    },
    onUpdate(props) {
      let html = props.editor.getHTML();

      html = html.replace(/<p>/g, '');
      html = html.replace(/<\/p>/g, '\n');

      onChange(html);
    },
  });
  return (
    <div className="flex flex-col justify-stretch gap-2">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
