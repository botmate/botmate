import type mongoose from 'mongoose';

/* eslint-disable @typescript-eslint/no-explicit-any */
export type BotInfo = {
  id: string;
  name: string;
  raw: Record<string, string | any>;
  avatar: string;
};

export enum PlatformType {
  Telegram = 'telegram',
  Discord = 'discord',
  Slack = 'slack',
}

type BasePlatformAnalytics = {
  title: string;
  description?: string;
  type: 'card' | 'barchart';
  startTime: Date;
  endTime: Date;
};

type CardPlatformAnalytics = BasePlatformAnalytics & {
  type: 'card';
  value: string;
};

type BarchartPlatformAnalytics = BasePlatformAnalytics & {
  type: 'barchart';
  data: {
    label: string;
    value: number;
  }[];
};

export type PlatformAnalytics =
  | CardPlatformAnalytics
  | BarchartPlatformAnalytics;

export abstract class Platform<TInstance = unknown> {
  abstract name: string;
  abstract instance: TInstance;

  abstract getBotInfo(): Promise<BotInfo>;
  abstract start(): Promise<void>;
  abstract stop(): Promise<void>;
  abstract init(db: typeof mongoose): void;
}
