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
      to: PATH.SITE_SCREEN.CHECKOUT,
      title: 'process',
    },
    {
      to: PATH.SITE_SCREEN.CATEGORY,
      title: 'dossier',
    },
    {
      to: PATH.SITE_SCREEN.BLOG,
      title: 'news',
    },
    {
      to: PATH.SITE_SCREEN.SUPPORT,
      title: 'contact',
    },
  ] as const;