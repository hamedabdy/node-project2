const { compileJsx } = require('../services/compileJsx');

/**
 * Middleware that intercepts writes to sys_ui_page,
 * compiles jsx_script, and injects jsx_compiled into the body
 * before the generic handler processes it.
 */
async function compileSysUiPage(req, res, next) {
  const { table_name } = req.params;

  // Only intercept sys_ui_page, pass everything else through immediately
  if (table_name !== 'sys_ui_page') return next();

  const { jsx_script } = req.body;

  // If no jsx_script in the payload, nothing to compile — pass through
  if (!jsx_script) return next();

  try {
    req.body.jsx_compiled = compileJsx(jsx_script);
    next(); // Inject compiled code and continue to generic handler
  } catch (err) {
    return res.status(400).json({
      error: 'JSX compilation failed',
      details: err.message,
    });
  }
}

module.exports = { compileSysUiPage };