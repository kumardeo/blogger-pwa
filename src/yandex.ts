import path from 'node:path';

export function getYandexManifest({ iconsBase = '/', color = '#fff', version = '1.0', apiVersion = 1, showTitle = true } = {}) {
  return {
    version,
    api_version: apiVersion,
    layout: {
      logo: path.posix.join(iconsBase, 'yandex-browser-50x50.png'),
      color,
      show_title: showTitle,
    },
  };
}
