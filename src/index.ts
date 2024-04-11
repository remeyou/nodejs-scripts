import { Features } from './constants'
import pickRandomFile from './lib/pickRandomFile'
import recursiveRenameFile from './lib/recursiveRenameFile'
import removeEmptyFolder from './lib/removeEmptyFolder'
import { askFeature, inquirerErr } from './utils'

const features = {
  [Features.Remove]: removeEmptyFolder,
  [Features.Rename]: recursiveRenameFile,
  [Features.Random]: pickRandomFile,
}

const userArgv0 = process.argv[2]
if (userArgv0) {
  if (userArgv0 === 'random') {
    pickRandomFile()
  }
} else {
  askFeature()
    .then((f) => features[f]())
    .catch(inquirerErr)
}
