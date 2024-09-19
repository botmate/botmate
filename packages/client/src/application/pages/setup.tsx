import { AreaChartIcon, BookIcon, PlugIcon } from 'lucide-react';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { Button, Card, Input } from '@botmate/ui';
import { motion } from 'framer-motion';

import { useCreateBotMutation, useGetPlatformsQuery } from '../services';

type Platform = {
  id: string;
  name: string;
  logo: string;
  steps: {
    title: string;
    description: string;
  }[];
};

const PLATFORMS: Record<string, Platform> = {
  Telegram: {
    id: 'telegram',
    name: 'Telegram',
    logo: '/platforms/telegram.svg',
    steps: [
      {
        title: 'Step 1: Create a bot',
        description:
          'To create a bot, you need to talk to the BotFather on Telegram.',
      },
      {
        title: 'Step 2: Get the token',
        description:
          'After creating the bot, you will get a token. Copy and paste it in the input box.',
      },
    ],
  },
  Discord: {
    id: 'discord',
    name: 'Discord',
    logo: '/platforms/discord.svg',
    steps: [
      {
        title: 'Step 1: Create a bot',
        description:
          'To create a bot, you need to create a new application on Discord Developer Portal.',
      },
      {
        title: 'Step 2: Get the token',
        description:
          'After creating the bot, you will get a token. Copy and paste it in the input box.',
      },
    ],
  },
  Slack: {
    id: 'slack',
    name: 'Slack',
    logo: '/platforms/slack.svg',
    steps: [
      {
        title: 'Step 1: Create a bot',
        description:
          'To create a bot, you need to create a new application on Slack API.',
      },
      {
        title: 'Step 2: Get the token and signing secret',
        description:
          'Copy and paste the values in the input box to connect your bot.',
      },
    ],
  },
};

function SetupPage() {
  const [step, setStep] = useState(1);
  const [platform, setPlatform] = useState<Platform | null>(null);
  const [
    createBot,
    { data: createBotResponse, isLoading: createBotIsLoading },
  ] = useCreateBotMutation();
  const { data: platforms } = useGetPlatformsQuery();
  const [credentials, setCredentials] = useState<Record<string, string>>({});

  const credentialsList =
    platforms?.filter((p) => p.displayName === platform?.name)?.[0]
      ?.credentials || {};

  console.log('credentialsList', credentialsList);

  return (
    <div className="flex items-center h-screen">
      <div className="w-[1200px] h-[600px] 2xl:h-[800px] mx-auto relative">
        <motion.div
          className="absolute w-full h-full mx-auto bg-card rounded-3xl border"
          animate={{
            rotate: step === 1 ? 0 : 1,
          }}
          transition={{
            bounce: 0.4,
          }}
        >
          <div className="2xl:p-24 p-12 rounded-t-3xl">
            <img
              src="/logo.svg"
              alt="BotMate"
              className="w-24 h-24 rounded-3xl"
            />
            <h1 className="mt-6 2xl:text-5xl text-4xl font-light">
              Let's setup your bot!
            </h1>
            <p className="2xl:text-lg mt-4 max-w-[850px] text-muted-foreground">
              BotMate is plugin based platform that allows you to create and
              manage your own chatbot. You can create your own plugins or use
              existing ones from the community.
            </p>
          </div>
          <div className="flex flex-col gap-4 2xl:p-24 p-12">
            <div className="grid grid-cols-4 gap-4 mt-2">
              {Object.entries(PLATFORMS).map(([key, platform]) => (
                <div
                  key={key}
                  className="h-40 w-40 rounded-3xl hover:bg-muted/50 hover:border-muted dark:hover:border-neutral-600 hover:scale-95 border-2 border-transparent cursor-pointer transition-all duration-150"
                  onClick={() => {
                    setStep(2);
                    setPlatform(platform);
                  }}
                >
                  <img
                    src={platform.logo}
                    className="h-40 w-40 rounded-3xl p-6"
                  />
                </div>
              ))}

              <div className="h-40 w-40 flex items-center justify-center">
                <p className="text-muted-foreground">More coming soon...</p>
              </div>
            </div>
          </div>
        </motion.div>
        {platform !== null && (
          <motion.div
            className="absolute w-full h-full mx-auto"
            initial={{
              opacity: 0,
              pointerEvents: 'none',
              top: 50,
              left: 0,
            }}
            animate={{
              opacity: step === 2 ? 1 : 0,
              pointerEvents: step === 2 ? 'all' : 'none',
              top: step === 2 ? 0 : 50,
              left: 10,
            }}
            transition={{
              duration: 1,
              bounce: 0.4,
              type: 'spring',
              delay: 0.1,
            }}
          >
            <Card className="w-full h-full mx-auto">
              <div className="p-4">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setStep(1);
                  }}
                >
                  Back
                </Button>
              </div>
              <div className="2xl:p-24 p-12">
                <h1 className="mt-6 2xl:text-5xl text-4xl font-light">
                  Continue with {platform.name}
                </h1>
                <p className="2xl:text-lg mt-4 max-w-[850px] text-muted-foreground">
                  Please follow the steps to obtain your bot credentials. And
                  enter them in the form below to connect your bot, and start
                  using BotMate.
                </p>
              </div>

              <div className="flex flex-col gap-12 2xl:p-24 p-12 pt-6">
                <div className="grid grid-cols-3 gap-6 items-center">
                  {platform.steps.map(({ title, description }) => (
                    <div className="flex flex-col gap-4" key={title}>
                      <h2 className="text-2xl font-light">{title}</h2>
                      <p className="text-muted-foreground">{description}</p>
                    </div>
                  ))}

                  <div className="flex flex-col gap-4 w-[300px] p-6 bg-card border rounded-xl">
                    {Object.entries(credentialsList).map(([key, value]) => (
                      <Input
                        key={key}
                        placeholder={value.description}
                        value={credentials[key] || ''}
                        onChange={(e) => {
                          setCredentials({
                            ...credentials,
                            [key]: e.target.value,
                          });
                        }}
                      />
                    ))}

                    <Button
                      onClick={() => {
                        createBot({
                          platform: platform.id,
                          credentials,
                        })
                          .unwrap()
                          .then(async () => {
                            setStep(3);
                          });
                      }}
                      isLoading={createBotIsLoading}
                    >
                      Connect
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
        {step === 3 && (
          <motion.div
            className="absolute w-full h-full mx-auto"
            initial={{
              opacity: 0,
              pointerEvents: 'none',
              top: 50,
              left: 0,
            }}
            animate={{
              opacity: step === 3 ? 1 : 0,
              pointerEvents: step === 3 ? 'all' : 'none',
              top: step === 3 ? 0 : 50,
              left: 10,
            }}
            transition={{
              duration: 1,
              bounce: 0.4,
              type: 'spring',
              delay: 0.1,
            }}
          >
            <Card className="w-full h-full mx-auto">
              <div className="2xl:p-24 p-12 text-center">
                <h1 className="mt-6 2xl:text-5xl text-4xl font-light">
                  Congratulations! {createBotResponse?.name} is connected 🎉
                </h1>
                <p className="2xl:text-lg mt-4 max-w-[850px] text-muted-foreground mx-auto">
                  Your bot is now connected to BotMate. You can now start
                  customizing your bot using plugins from the community or
                  create your own.
                </p>
              </div>

              <div className="flex flex-col gap-12 items-center justify-center">
                <div className="grid grid-cols-3 gap-6 items-center">
                  {[
                    {
                      icon: PlugIcon,
                      title: 'Plugins',
                      description: 'Extend your bot functionality with plugins',
                    },
                    {
                      icon: AreaChartIcon,
                      title: 'Analytics',
                      description:
                        'Analyze your bot performance with analytics',
                    },
                    {
                      icon: BookIcon,
                      title: 'Reports',
                      description:
                        'Generate reports and insights from your bot',
                    },
                  ].map(({ icon: Icon, title, description }) => (
                    <div
                      className="flex flex-col gap-2 h-40 w-full items-center justify-center text-center"
                      key={title}
                    >
                      <Icon size={48} />
                      <h2 className="text-2xl font-light">{title}</h2>
                      <p className="text-muted-foreground text-sm">
                        {description}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="space-x-4 mt-4">
                  <Link to={`/bots/${createBotResponse?.id}`}>
                    <Button>Get Started</Button>
                  </Link>
                  <Button variant="outline">Need help</Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default SetupPage;
