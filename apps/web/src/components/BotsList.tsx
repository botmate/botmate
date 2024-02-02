import { FaTelegram } from 'react-icons/fa';
import { Bot } from '@prisma/client';
import { Card, CardHeader, Divider, CardBody, Button } from '@nextui-org/react';
import Link from 'next/link';
import { Platform } from '@botmate/shared';
import { IconType } from 'react-icons';

const PlatformIcon: Record<Platform, IconType> = {
  telegram: FaTelegram,
  discord: FaTelegram,
  slack: FaTelegram,
};

type BotsListProps = {
  bots: Bot[];
};
function BotsList({ bots }: BotsListProps) {
  return (
    <div className="p-4">
      <p className="text-default-500">Here are the bots you have added</p>
      <div className="grid md:grid-cols-3 grid-cols-1 mt-4">
        {bots.map((bot) => {
          const Icon = PlatformIcon[bot.platform as Platform];
          return (
            <Card key={bot.id} className="relative">
              <div className="absolute top-2 right-2">
                <Icon size={30} opacity={0.4} />
              </div>
              <CardHeader className="flex gap-3">
                <div className="flex flex-col">
                  <h1 className="text-xl font-semibold">{bot.name}</h1>
                  <p className="text-small text-default-500">{bot.id}</p>
                </div>
              </CardHeader>
              <CardBody>
                <div className="flex items-center gap-2">
                  <Button
                    as={Link}
                    disableRipple
                    color="primary"
                    href={`/bots/${bot.id}`}
                  >
                    Manage
                  </Button>

                  <Button disableRipple variant="light">
                    Delete
                  </Button>
                </div>
              </CardBody>
              <Divider />
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export { BotsList };
