const babel = require('@babel/core');

/**
 * Compiles raw JSX string to a browser-executable CommonJS module.
 * Call this when a record is saved/updated in sys_ui_page.
 */
function compileJsx(rawJsx) {
  const result = babel.transformSync(rawJsx, {
    presets: [
      ['@babel/preset-env', { targets: { browsers: 'last 2 versions' }, modules: 'commonjs' }],
      ['@babel/preset-react', { runtime: 'classic' }]
    ],
    filename: 'sys_ui_page_dynamic-component.jsx',
  });

  if (!result || !result.code) {
    throw new Error('Compilation failed: empty output');
  }
  return result.code;
}

module.exports = { compileJsx };