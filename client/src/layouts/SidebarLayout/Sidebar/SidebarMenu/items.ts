import { ReactNode } from 'react';

import BallotTwoToneIcon from '@mui/icons-material/BallotTwoTone';
import ExitToAppIconTwoTone from '@mui/icons-material/ExitToAppTwoTone';
import TwoWheelerIconTwoTone from '@mui/icons-material/TwoWheelerTwoTone';
import EventAvailableIconTwoTone from '@mui/icons-material/EventAvailableTwoTone';

export interface MenuItem {
  link?: string;
  icon?: ReactNode;
  badge?: string;
  items?: MenuItem[];
  name: string;
}

export interface MenuItems {
  items: MenuItem[];
  heading: string;
}

const menuItems: MenuItems[] = [
  
  {
    heading: 'Main',
    items: [
      {
        name: 'Trip Diary',
        link: '/dashboard/diary',
        icon: BallotTwoToneIcon
      },
      {
        name: 'Garage',
        link: '/dashboard/garage',
        icon: TwoWheelerIconTwoTone
      },
      {
        name: 'Rides Calendar',
        link: '/dashboard/calendar',
        icon: EventAvailableIconTwoTone
      },
      {
        name: 'Logout',
        link: '/dashboard/logout',
        icon: ExitToAppIconTwoTone
      }
    ]
  },
];

export default menuItems;
