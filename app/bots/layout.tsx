import React from 'react';

import { MainLayout } from '#components/layouts';

type Props = {
  children: React.ReactNode;
};
function BotsLayout({ children }: Props) {
  return <MainLayout>{children}</MainLayout>;
}

export default BotsLayout;
