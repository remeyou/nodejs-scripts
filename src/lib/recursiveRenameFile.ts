import { readdir, rename, stat } from 'fs/promises'
import { parse, resolve } from 'path'
import { askPath, infoFmt, inquirerErr, successFmt } from '../utils'

const renameFile = (path: string, index?: number) => {
  const { dir, ext } = parse(path)
  const parentDir = dir.split('\\').at(-1)
  const suffix = index ? '-' + index : ''
  const newPath = resolve(dir, parentDir + suffix + ext)
  rename(path, newPath).then(() =>
    console.log(successFmt('renamed'), infoFmt('->'), newPath),
  )
}

const handleDir = (path: string) =>
  readdir(path).then((list) =>
    list.map((file) => resolve(path, file)).forEach(handleFile),
  )

const handleFile = (path: string, index?: number) =>
  stat(path).then((stats) => {
    if (stats.isFile()) renameFile(path, index)
    if (stats.isDirectory()) handleDir(path)
  })

const recursiveRenameFile = () => askPath().then(handleFile).catch(inquirerErr)

export default recursiveRenameFile
