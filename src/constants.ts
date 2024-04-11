export const enum Features {
  Rename,
  Remove,
  Random,
}

export const FILETYPE = {
  jpg: 'jpg',
  png: 'png',
} as const

export const enum ErrorMsg {
  UserCancel = 'User force closed the prompt with 0 null',
}
