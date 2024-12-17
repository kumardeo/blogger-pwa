import type { Config } from './types';

export default {
  version: '1.0',
  id: '/',
  name: 'صِوانˣʸᶻ',
  shortName: 'SiwaneXYZ',
  description: 'ثبت صوانˣʸᶻ الان و استمتع بمجمل المواضيع المفيدة و الحصرية',
  direction: 'auto',
  language: 'ar-MA',
  backgroundColor: '#fff',
  themeColor: '#fff',
  display: 'standalone',
  orientation: 'any',
  scope: '/',
  startUrl: '/?utm_source=homescreen',
  appleStatusBarStyle: 'black-translucent',
  preferRelatedApplications: false,
  shortcuts: [
    {
      name: 'صِوانˣʸᶻ',
      shortName: 'SiwaneXYZ',
      description: 'صوانˣʸᶻ مدونة تعليمية تقدم دروس في احتراف بلوجر و اليوتيوب و الربح من الانترنت.',
      url: '/?utm_source=homescreen',
    },
    {
      name: 'حول المدونة',
      shortName: 'حول المدونة',
      description: 'استكشف مدونة صوان للتقنية',
      url: '/p/about.html?utm_source=homescreen',
    },
    {
      name: 'سياسة الخصوصية',
      shortName: 'الخصوصية',
      description: 'احتراف التدوين و اليوتيوب و تطوير المحتوى و السيو و الربح من الانترنت.',
      url: '/p/privacy.html?utm_source=homescreen',
    },
  ],
  pwa: {
    logs: true,
    // OneSignal is not available if you are not using cloudflare workers
    oneSignalEnabled: false,
    oneSignalConfig: {
      appId: 'b0cd2165-a3c0-4ed7-a609-a78675fcbd69',
      allowLocalhostAsSecureOrigin: true,
    },
  },
  // Please replace with your blog url if you are using CDN (JsDelivr)
  origin: 'https://hello-example.blogspot.com',
} satisfies Config;
