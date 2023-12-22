import { Features } from './constants'
import recursiveRenameFile from './lib/recursiveRenameFile'
import removeEmptyFolder from './lib/removeEmptyFolder'
import { askFeature, inquirerErr } from './utils'

const features = {
  [Features.Remove]: removeEmptyFolder,
  [Features.Rename]: recursiveRenameFile,
}

askFeature()
  .then((f) => features[f]())
  .catch(inquirerErr)
