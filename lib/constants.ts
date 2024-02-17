export const PlatformList = [
  {
    id: 'telegram',
    name: 'Telegram',
    icon: '/assets/telegram.svg',
    credentials: [
      {
        id: 'token',
        title: 'Bot Token',
        message: 'Enter your bot token',
      },
    ],
  },
  {
    id: 'discord',
    name: 'Discord',
    icon: '/assets/discord.svg',
    credentials: [
      {
        id: 'token',
        title: 'Bot Token',
        message: 'Enter your bot token',
      },
    ],
  },
  {
    id: 'slack',
    name: 'Slack',
    icon: '/assets/slack.svg',
    credentials: [
      {
        id: 'client',
        title: 'Client ID',
        message: 'Enter your client ID',
      },
      {
        id: 'secret',
        title: 'Client Secret',
        message: 'Enter your client secret',
      },
    ],
  },
];
