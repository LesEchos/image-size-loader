/* eslint-disable import/prefer-default-export */

// TODO: ask 'schema-utils' or 'webpack' to export SchemaType
import { validate } from 'schema-utils';

/**
 * Schema help Webpack to validate loaders options
 * @see {@link https://github.com/webpack/schema-utils}
 */
export const SCHEMA: Parameters<typeof validate>[0] = {
  additionalProperties: true,
  properties: {
    name: {
      description: 'The filename template for the target file(s).',
      link: 'https://github.com/webpack-contrib/file-loader#name',
      anyOf: [
        {
          type: 'string',
        },
        {
          instanceof: 'Function',
        },
      ],
    },
    outputPath: {
      description: 'A filesystem path where the target file(s) will be placed.',
      link: 'https://github.com/webpack-contrib/file-loader#outputpath',
      anyOf: [
        {
          type: 'string',
        },
        {
          instanceof: 'Function',
        },
      ],
    },
    publicPath: {
      description: 'A custom public path for the target file(s).',
      link: 'https://github.com/webpack-contrib/file-loader#publicpath',
      anyOf: [
        {
          type: 'string',
        },
        {
          instanceof: 'Function',
        },
      ],
    },
    postTransformPublicPath: {
      description: 'A custom transformation function for post-processing the publicPath.',
      link: 'https://github.com/webpack-contrib/file-loader#posttransformpublicpath',
      instanceof: 'Function',
    },
    context: {
      description: 'A custom file context.',
      link: 'https://github.com/webpack-contrib/file-loader#context',
      type: 'string',
    },
    emitFile: {
      description: 'Enables/Disables emit files.',
      link: 'https://github.com/webpack-contrib/file-loader#emitfile',
      type: 'boolean',
    },
    regExp: {
      description:
        'A Regular Expression to one or many parts of the target file path. The capture groups can be reused in the name property using [N] placeholder.',
      link: 'https://github.com/webpack-contrib/file-loader#regexp',
      anyOf: [
        {
          type: 'string',
        },
        {
          instanceof: 'RegExp',
        },
      ],
    },
  },
  type: 'object',
};
