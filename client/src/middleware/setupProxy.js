const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'https://qms-admin.iky.vn',
            changeOrigin: true,
            pathRewrite: {
                '^/api': '',
            },
        }),
    );
};
