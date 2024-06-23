import path from 'node:path';
import { js2xml } from 'xml-js';

export const getBrowserConfig = ({ iconsPath = '/', tileColor = '#fff' } = {}) =>
  js2xml(
    {
      declaration: {
        attributes: {
          version: '1.0',
          encoding: 'utf-8',
        },
      },
      elements: [
        {
          type: 'element',
          name: 'browserconfig',
          elements: [
            {
              type: 'element',
              name: 'msapplication',
              elements: [
                {
                  type: 'element',
                  name: 'tile',
                  elements: [
                    {
                      type: 'element',
                      name: 'square70x70logo',
                      attributes: {
                        src: path.posix.join(iconsPath, 'mstile-70x70.png'),
                      },
                    },
                    {
                      type: 'element',
                      name: 'square150x150logo',
                      attributes: {
                        src: path.posix.join(iconsPath, 'mstile-150x150.png'),
                      },
                    },
                    {
                      type: 'element',
                      name: 'wide310x150logo',
                      attributes: {
                        src: path.posix.join(iconsPath, 'mstile-310x150.png'),
                      },
                    },
                    {
                      type: 'element',
                      name: 'square310x310logo',
                      attributes: {
                        src: path.posix.join(iconsPath, 'mstile-310x310.png'),
                      },
                    },
                    {
                      type: 'element',
                      name: 'TileColor',
                      elements: [
                        {
                          type: 'text',
                          text: tileColor,
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      spaces: 2,
    },
  );
