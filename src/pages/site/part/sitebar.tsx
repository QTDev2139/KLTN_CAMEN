import { PATH } from "~/router";

export const sidebars = [
    {
      to: PATH.SITE_SCREEN.HOME,
      title: 'intro',
    },
    {
      to: PATH.SITE_SCREEN.PRODUCT,
      title: 'products',
    },
    {
      to: PATH.SITE_SCREEN.HOME,
      title: 'process',
    },
    {
      to: PATH.SITE_SCREEN.HOME,
      title: 'dossier',
    },
    {
      to: PATH.SITE_SCREEN.HOME,
      title: 'news',
    },
    {
      to: PATH.SITE_SCREEN.HOME,
      title: 'media',
    },
    {
      to: PATH.SITE_SCREEN.SUPPORT,
      title: 'contact',
    },
  ] as const;