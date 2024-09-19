import {
  BookIcon,
  HammerIcon,
  HelpCircle,
  InfoIcon,
  PlugIcon,
} from 'lucide-react';
import React, { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';

import { PageLayout } from '@botmate/ui';

function DashboardPage() {
  const params = useParams();
  const notes = useMemo(
    () => [
      {
        title: 'Documentation',
        description: 'Dsicover more about the bots and how to use them.',
        icon: InfoIcon,
        link: 'https://docs.botmate.dev',
      },
      {
        title: 'Plugins',
        description: 'Discover more about the plugins and how to use them.',
        icon: PlugIcon,
        link: `https://docs.botmate.dev/plugins/introduction`,
      },
      {
        title: 'Blogs',
        description: 'Read the latest blogs about the bots and plugins.',
        icon: BookIcon,
        link: 'https://blog.botmate.dev',
      },
      {
        title: 'Help',
        description: 'Get help from the community and the team.',
        icon: HelpCircle,
        link: 'https://t.me/chatbotmate',
      },
    ],
    [params.botId],
  );
  return (
    <PageLayout
      title="Dashboard"
      subtitle="Welcome to the dashboard. Here you can see all the important information about the bot."
    >
      <div>
        <div className="h-72 flex items-center justify-center gap-4 flex-col border rounded-3xl bg-card text-muted-foreground">
          <HammerIcon size={60} />
          <p>The page is under construction. Please check back later.</p>
        </div>
      </div>
      <div>
        <div className="grid grid-cols-1 gap-4">
          {notes.map((note, index) => (
            <Link
              key={index}
              className="p-4 bg-card rounded-xl hover:bg-primary hover:text-primary-foreground group cursor-pointer border"
              to={note.link}
              draggable="false"
            >
              <div className="flex items-center">
                <note.icon
                  className="text-primary group-hover:text-primary-foreground"
                  size={20}
                />
                <h2 className="ml-2 font-medium">{note.title}</h2>
              </div>
              <p className="mt-2 text-muted-foreground text-sm group-hover:text-primary-foreground">
                {note.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}

export default DashboardPage;
