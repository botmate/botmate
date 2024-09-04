import { Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { Application, Events } from '../application';

type Props = {
  app: Application;
};
function Loader({ app }: Props) {
  const [loading, setLoading] = useState('');

  useEffect(() => {
    app.emitter.on(Events.Loading, (text) => {
      setLoading(text);
    });
    app.emitter.on(Events.Loaded, () => {
      setLoading('');
    });
  }, []);

  if (loading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-opacity-50 z-50 backdrop-blur">
        <div className="flex items-center justify-center space-x-2 text-card-foreground px-8 py-6 bg-card border rounded-3xl">
          <Loader2 className="animate-spin" size={24} />
          <span>{loading}</span>
        </div>
      </div>
    );
  }

  return <></>;
}

export default Loader;
