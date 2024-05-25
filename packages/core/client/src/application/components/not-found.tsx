import { useState } from 'react';

function NotFoundPage() {
  const [state, setState] = useState(0);

  return (
    <div className="h-screen flex flex-col justify-center items-center space-y-4">
      <h1 className="font-bold text-2xl">Not Found</h1>
      <p>Sorry, the page you were looking for could not be found.</p>

      <button onClick={() => setState(state + 1)}>Click me {state}</button>
    </div>
  );
}

export default NotFoundPage;
