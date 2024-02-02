const platfomrs = ['telegram', 'discord', 'slack'] as const;

export type Platform = (typeof platfomrs)[number];
