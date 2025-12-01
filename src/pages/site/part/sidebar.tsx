import { PATH } from "~/router";

export const sidebars = [
    {
      to: PATH.SITE_SCREEN.HOME,
      title: 'intro',
    },
    {
      to: PATH.SITE_SCREEN.PRODUCT.ROOT,
      title: 'products',
      children: [
        {
          to: PATH.SITE_SCREEN.PRODUCT.DOMESTIC,
          title: 'products-domestic'
        },
        {
          to: PATH.SITE_SCREEN.PRODUCT.EXPORT,
          title: 'products-export'
        }
      ]
    },
    {
      to: PATH.SITE_SCREEN.PRODUCTION_PROCESS,
      title: 'process',
    },
    {
      to: PATH.SITE_SCREEN.DECLARATION,
      title: 'dossier',
    },
    {
      to: PATH.SITE_SCREEN.BLOG,
      title: 'news',
    },
    {
      to: PATH.SITE_SCREEN.CONTACT,
      title: 'contact',
    },
  ] as const;


  