const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Use environment variable if set (for Docker), otherwise use localhost (for local dev)
  const target = process.env.REACT_APP_API_URL || 'http://localhost:8800';
  
  app.use(
    '/api',
    createProxyMiddleware({
      target: target,
      changeOrigin: true,
      logLevel: 'debug',
    })
  );
};

