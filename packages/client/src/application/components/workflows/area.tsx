import WorkflowSidebar from './sidebar';

function WorkflowArea() {
  return (
    <div className="flex h-full">
      <div className="flex-1 overflow-auto"></div>
      <div className="w-96 border-l overflow-auto">
        <WorkflowSidebar />
      </div>
    </div>
  );
}

export default WorkflowArea;
