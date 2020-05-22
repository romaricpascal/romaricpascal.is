const test = require('ava');
const pathInfo = require('../pathInfo');

function testPlugin(
  t,
  {
    plugin = pathInfo,
    file = {},
    filePath = 'path/to/a/file.extension',
    files = {
      [filePath]: file
    }
  } = {},
  expected = {}
) {
  const middleware = plugin();
  middleware(files);

  Object.entries(expected).forEach(([key, value]) => {
    // Use the key as failure message to identify
    // which key failed
    t.deepEqual(file.pathInfo[key], value, key);
  });
}

testPlugin.title = (providedTitle = '', { filePath } = {}) =>
  providedTitle || filePath;

test(
  testPlugin,
  {
    filePath: 'path/to/a/file.extension'
  },
  {
    path: 'path/to/a/file.extension',
    stem: 'path/to/a/file',
    extension: 'extension',
    extensions: 'extension',
    extensionList: ['extension'],
    dirName: 'path/to/a',
    baseName: 'file',
    fileName: 'file.extension'
  }
);

test(
  testPlugin,
  { filePath: 'a/file.with.multiple.extensions' },
  {
    extension: 'extensions',
    extensions: 'with.multiple.extensions',
    extensionList: ['with', 'multiple', 'extensions']
  }
);

test(
  testPlugin,
  { filePath: 'a/file-with-no-extension' },
  {
    baseName: 'file-with-no-extension',
    fileName: 'file-with-no-extension',
    extensions: '',
    extension: '',
    extensionList: []
  }
);
