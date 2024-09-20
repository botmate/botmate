import {
  BookIcon,
  HelpCircle,
  InfoIcon,
  PlugIcon,
  PlusIcon,
} from 'lucide-react';
import React, { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';

import { Button, PageLayout } from '@botmate/ui';

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
      <div className="h-full relative flex-1">
        <div className="flex flex-col gap-6 items-center justify-center absolute inset-0">
          <div className="text-center">
            <h1 className="text-2xl">Configure your dashboard</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Drag and drop widgets to configure your dashboard.
            </p>
          </div>
          <Button size="sm">
            <PlusIcon className="mr-2" size={16} />
            Add Widget
          </Button>
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
