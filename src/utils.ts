import input from '@inquirer/input'
import select from '@inquirer/select'
import chalk from 'chalk'
import { isAbsolute } from 'path'
import { ErrorMsg, Features } from './constants'

export const errorFmt = chalk.red
export const successFmt = chalk.green
export const infoFmt = chalk.dim

export const askFeature = () =>
  select({
    message: 'Which feature do you need?',
    choices: [
      {
        name: 'Recursive rename files',
        value: Features.Rename,
        description: infoFmt(
          'Entering a directory path, rename all files in subdirectories to parent. The multiple files will add a suffix by index.',
        ),
      },
      {
        name: 'Remove empty folders',
        value: Features.Remove,
        description: infoFmt(
          'Entering a directory path, remove all empty folders recursively.',
        ),
      },
    ],
  })

export const askPath = () =>
  input({
    message: 'Please input a path for feature execution:',
    validate(value) {
      if (!isAbsolute(value)) {
        return errorFmt(`'${value}' is not an available filesystem path.`)
      }
      return true
    },
  })

export const inquirerErr = (err: unknown) =>
  err instanceof Error && err.message === ErrorMsg.UserCancel
    ? console.log(infoFmt('Ctrl + C pressed, script will exit.'))
    : console.error(errorFmt('Oops! script crashed.'), err)
