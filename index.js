module.exports = {
  connectionURI: 'mongodb://localhost:27017/semtab/',
  browserifyModules: ['paperclip/lib/node.js', 'vue', 'oboe'],
  routes: [
    "echo.js",
    "table.js",
    "v3.js"
  ]

}
