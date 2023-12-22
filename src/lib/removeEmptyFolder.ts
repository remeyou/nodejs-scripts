import { readdir, rmdir, stat } from 'fs/promises'
import { resolve } from 'path'
import { askPath, inquirerErr, secondaryFmt, successFmt } from '../utils'

const removeDir = (path: string) =>
  rmdir(path).then(() =>
    console.log(successFmt('removed'), secondaryFmt('->'), path),
  )

const handleDir = (path: string) =>
  readdir(path).then((list) =>
    list.length
      ? list.map((file) => resolve(path, file)).forEach(handleFile)
      : removeDir(path),
  )

const handleFile = (path: string) =>
  stat(path).then((stats) => {
    if (stats.isDirectory()) handleDir(path)
  })

const removeEmptyFolder = () => askPath().then(handleFile).catch(inquirerErr)

export default removeEmptyFolder
