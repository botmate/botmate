import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { Session } from 'next-auth';
import Providers from '@web/providers';

import './globals.css';

const poppins = Poppins({
  subsets: ['latin-ext'],
  weight: ['400', '500', '600'],
});

export const metadata: Metadata = {
  title: 'botmate',
  description: 'platform to build bots',
};

type DefaultLayoutProps = {
  children: React.ReactNode;
};
type Props = {
  children: React.ReactNode;
  session: Session;
};
export default async function RootLayout(props: DefaultLayoutProps | Props) {
  const { children, session } = {
    ...props,
    session: undefined,
  };

  return (
    <html lang="en">
      <body className={`${poppins.className}`}>
        {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
        <Providers session={session!}>{children}</Providers>
      </body>
    </html>
  );
}
