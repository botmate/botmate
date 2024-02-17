import { IconType } from 'react-icons';

export type MenuItem = {
  label: string;
  path: string;
  icon: IconType;
  exact?: boolean;
};
