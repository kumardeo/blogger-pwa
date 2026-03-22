import { defineConfig } from '@/types/config';

export default defineConfig({
  manifest: {
    id: '/',
    name: 'My Blog',
    short_name: 'My Blog',
    description: 'My blog description goes here...',
    dir: 'auto',
    lang: 'en-US',
    background_color: '#fff',
    theme_color: '#fff',
    display: 'standalone',
    orientation: 'natural',
    scope: '/',
    start_url: '/?utm_source=homescreen',
    prefer_related_applications: false,
    shortcuts: [
      {
        name: 'Shortcut 1',
        short_name: 'Shortcut 1',
        description: 'Shortcut 1 description goes here...',
        url: '/search/label/shortcut-1?utm_source=homescreen',
      },
      {
        name: 'Shortcut 2',
        short_name: 'Shortcut 2',
        description: 'Shortcut 2 description goes here...',
        url: '/search/label/shortcut-2?utm_source=homescreen',
      },
    ],
  },

  pwa: {
    logs: true,
  },

  // OneSignal is only available if you are using cloudflare workers
  oneSignal: {
    enabled: false, // To enable OneSignal, set this to true
    appId: '********-****-****-****-************', // Replace with your OneSignal App Id
    allowLocalhostAsSecureOrigin: true,
  },

  // Please replace with your blog url if you are using CDN (JsDelivr)
  origin: 'https://hello-example.blogspot.com',
});
