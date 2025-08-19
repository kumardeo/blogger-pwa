import type { Config } from './types';

export default {
  id: '/',
  name: 'Asha Real Estate',
  shortName: 'Asha Real Estate',
  description: 'Asha Real Estate Vadodra | Buy, Sell, Rent Property in Vadodara, Flats, Villa, offices, House.',
  direction: 'auto',
  language: 'en-US',
  backgroundColor: '#fff',
  themeColor: '#fff',
  display: 'standalone',
  orientation: 'natural',
  scope: '/',
  startUrl: '/?utm_source=homescreen',
  appleStatusBarStyle: 'black-translucent',
  preferRelatedApplications: false,
  shortcuts: [
    {
      name: 'Asha Real Estate',
      shortName: 'Asha Real Estate',
      description: 'Asha Real Estate Vadodra | Buy, Sell, Rent Property in Vadodara, Flats, Villa, offices, House.',
      url: '/search/label/shortcut-1?utm_source=homescreen',
    },
    {
      name: 'Asha Real Estate',
      shortName: 'Asha Real Estate',
      description: 'Asha Real Estate Vadodra | Buy, Sell, Rent Property in Vadodara, Flats, Villa, offices, House.',
      url: '/search/label/shortcut-2?utm_source=homescreen',
    },
  ],
  pwa: {
    logs: true,
    // OneSignal is only available if you are using cloudflare workers
    oneSignalEnabled: false, // To enable OneSignal, set this to true
    oneSignalConfig: {
      appId: '********-****-****-****-************', // Replace with your OneSignal App Id
      allowLocalhostAsSecureOrigin: true,
    },
  },
  // Please replace with your blog url if you are using CDN (JsDelivr)
  origin: 'https://asharealestate.asnp.in',
} satisfies Config;
