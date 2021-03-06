/* eslint-disable
  multiline-ternary,
*/
import path from 'path';
import fs from 'fs';

import sizeOf from 'image-size';
import loaderUtils from 'loader-utils';
import validateOptions from 'schema-utils';

import schema from './options.json';

function imageToString(image) {
  return `
    module.exports = {
      src: ${image.src},
      width: ${JSON.stringify(image.width)},
      height: ${JSON.stringify(image.height)},
      bytes: ${JSON.stringify(image.bytes)},
      type: ${JSON.stringify(image.type)},
    };
    // For requires from CSS when used with webpack css-loader,
    // outputting an Object doesn't make sense,
    // So overriding the toString method to output just the URL
    module.exports.toString = function() {
      return ${image.src};
    };
  `;
}

export default function imageSizeLoader(content) {
  if (!this.emitFile) {
    throw new Error('File Loader\n\nemitFile is required from module system');
  }

  const options = loaderUtils.getOptions(this) || {};

  validateOptions(schema, options, 'File Loader');

  const context =
    options.context ||
    this.rootContext ||
    (this.options && this.options.context);

  const url = loaderUtils.interpolateName(this, options.name, {
    context,
    content,
    regExp: options.regExp,
  });

  const image = sizeOf(this.resourcePath);
  image.bytes = fs.statSync(this.resourcePath).size;

  let outputPath = url;

  if (options.outputPath) {
    if (typeof options.outputPath === 'function') {
      outputPath = options.outputPath(url);
    } else {
      outputPath = path.posix.join(options.outputPath, url);
    }
  }

  if (options.useRelativePath) {
    const filePath = this.resourcePath;

    const issuer = options.context
      ? context
      : this._module && this._module.issuer && this._module.issuer.context;

    const relativeUrl =
      issuer &&
      path
        .relative(issuer, filePath)
        .split(path.sep)
        .join('/');

    const relativePath = relativeUrl && `${path.dirname(relativeUrl)}/`;
    // eslint-disable-next-line no-bitwise
    if (~relativePath.indexOf('../')) {
      outputPath = path.posix.join(outputPath, relativePath, url);
    } else {
      outputPath = path.posix.join(relativePath, url);
    }
  }

  let publicPath = `__webpack_public_path__ + ${JSON.stringify(outputPath)}`;

  if (options.publicPath) {
    if (typeof options.publicPath === 'function') {
      publicPath = options.publicPath(url);
    } else if (options.publicPath.endsWith('/')) {
      publicPath = options.publicPath + url;
    } else {
      publicPath = `${options.publicPath}/${url}`;
    }

    publicPath = JSON.stringify(publicPath);
  }

  image.src = publicPath;

  // eslint-disable-next-line no-undefined
  if (options.emitFile === undefined || options.emitFile) {
    this.emitFile(outputPath, content);
  }

  return imageToString(image);
}

export const raw = true;
