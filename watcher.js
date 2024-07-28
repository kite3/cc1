const chokidar = require('chokidar')
const axios = require('axios')
const path = require('path')

// 监视 assets/Scripts 文件夹内的所有 TypeScript 文件
const watcher = chokidar.watch(path.join(__dirname, 'assets/Scripts/**/*.ts'), {
  ignored: /(^|[\/\\])\../,
  persistent: true
})

watcher.on('change', filePath => {
  console.log(`File ${filePath} has been changed`)

  // 执行 curl 请求
  axios
    .get('http://localhost:7456/asset-db/refresh')
    .then(response => {
      console.log('Asset database refreshed')
    })
    .catch(error => {
      console.error('Error refreshing asset database:', error)
    })
})

console.log('Watching for changes in Scripts folder...')
