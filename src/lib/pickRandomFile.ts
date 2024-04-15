import { execFile } from 'child_process'
import { mkdir, readFile, readdir, stat, writeFile } from 'fs/promises'
import { parse, resolve } from 'path'
import { askFiletype, askPath } from '../utils'

const generateCache = async (path: string, cachePath: string) => {
  console.log('Generating cache, it will take for a moment...')
  const list = await readdir(path, { recursive: true })
  writeFile(cachePath, JSON.stringify({ timestamp: Date.now(), path, list }), {
    encoding: 'utf-8',
  })
  return list
}

const readCache = async (path: string, tmpPath: string) => {
  const cachePath = tmpPath + '\\' + parse(path).name + '.txt'
  try {
    await stat(cachePath)
    const cache = JSON.parse(await readFile(cachePath, { encoding: 'utf-8' }))
    if (
      path === cache.path &&
      Date.now() - cache.timestamp < 24 * 60 * 60 * 1000
    ) {
      return cache.list as string[]
    }
  } catch (error) {}
  return generateCache(path, cachePath)
}

const init = async (path: string) => {
  const tmpPath = __dirname + '\\tmp'
  try {
    await stat(tmpPath)
  } catch (error) {
    await mkdir(tmpPath, { recursive: true })
  }

  return readCache(path, tmpPath)
}

const pickRandomFile = async () => {
  const path = process.argv[3] || (await askPath())
  const acceptFiletype = process.argv[4] || (await askFiletype()).join(',')

  const list = await init(path)
  let idx = Math.floor(Math.random() * list.length)
  const initIdx = idx

  while (true) {
    const relativePath = list[idx]
    const absolutePath = resolve(path, relativePath)
    const { ext } = parse(absolutePath)

    if (ext && (!acceptFiletype || acceptFiletype.includes(ext.slice(1)))) {
      try {
        await stat(absolutePath)
        console.log('[OPEN]', absolutePath)
        execFile(`explorer`, [absolutePath])
        break
      } catch (error) {
        console.log('[NO EXIST]', absolutePath)
      }
    } else {
      console.log('[SKIP]', absolutePath)
    }

    idx = idx === list.length - 1 ? 0 : idx + 1
    if (idx === initIdx) {
      console.log('Cannot find a proper file.')
      break
    }
  }
}

export default pickRandomFile
