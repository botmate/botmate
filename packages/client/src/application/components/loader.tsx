import React from 'react';

type Props = {
  children: React.ReactNode;
};
function PreLoader({ children }: Props) {
  return <>{children}</>;
}

export default PreLoader;
