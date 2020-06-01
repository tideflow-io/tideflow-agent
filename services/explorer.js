const os = require('os')
const path = require('path')
const { readdirSync } = require('fs')

const userHome = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME']

const sortBy = (key, desc) => {
  return (a, b) => {
    return (a[key] > b[key]) ? desc ? 1 : 0 : ((b[key] > a[key]) ? desc ? 0 : -1 : desc ? -1 : 0)
  };
}

const getDirectories = source =>
  readdirSync(source, { withFileTypes: true })
    .filter(dirent => {
      return (dirent.isFile() || dirent.isDirectory()) && !dirent.name.startsWith('.')
    })
    .map(dirent => {
      return {
        name: dirent.name,
        isFolder: dirent.isDirectory(),
        fullPath: path.join(source, dirent.name),
        ext: path.extname(dirent.name).replace('.','')
      }
    })
    .concat()
    .sort(sortBy('name', false))
    .sort(sortBy('isFolder', true))
    .reverse()

const browse = (socket, cmd, req) => {
  const { dir } = req
  const result = getDirectories(dir || userHome)
  return {
    hostname: os.hostname(),
    hasParent: process.platform === 'win32' ? dir !== 'C:\\' : dir !== '/',
    parentPath: path.resolve(dir || userHome, '..'),
    dir: dir || userHome,
    list: result
  }
}

module.exports.browse = browse