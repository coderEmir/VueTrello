module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        pathRewrite: {
          '^/api': '/api/v2'
        }
      }
    }
  },
  // lintOnSave: false
}