import { Handle, NodeProps, Position } from '@xyflow/react';

type BaseNodeProps = NodeProps & {
  data: Record<string, any>;
  type: 'action' | 'condition' | 'event';
  values?: Record<string, string>;
};

const NO_PREVIEW = 'No preview';

function BaseNode({ id, data, type, values }: BaseNodeProps) {
  function getPreview() {
    const templ = data.event?.preview ?? data.action?.preview ?? NO_PREVIEW;
    if (!values) return templ;

    const matches = templ.match(/{(.*?)}/g);
    if (!matches) return templ;

    let result = templ;
    matches.forEach((match: string) => {
      const key = match.replace(/{|}/g, '');
      const value = values[`${id}_${key}`];
      console.log('value', value);
      result = result.replace(match, value ?? '');
    });

    return result;
  }

  const preview = getPreview();

  return (
    <>
      <div className="dark:bg-muted bg-white border border-neutral-500 rounded-md">
        <div className="px-2 py-1 border-b border-neutral-400">
          <p className="text-[10px]">{data.label}</p>
        </div>

        <div className="px-2 py-1">
          <p
            className={`text-[8px] mt-1 ${
              preview === NO_PREVIEW ? 'text-muted-foreground' : ''
            }`}
          >
            {preview}
          </p>
        </div>
      </div>

      {type === 'event' ? (
        <>
          <Handle position={Position.Bottom} type="target" />
        </>
      ) : type === 'action' ? (
        <>
          <Handle position={Position.Top} type="source" />
          <Handle position={Position.Bottom} type="target" />
        </>
      ) : type === 'condition' ? (
        <>
          <Handle position={Position.Top} type="source" />
          <Handle position={Position.Right} type="target" id="true" />
          <Handle position={Position.Left} type="target" id="false" />
        </>
      ) : null}
    </>
  );
}

export default BaseNode;
