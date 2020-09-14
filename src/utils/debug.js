export function warn(msg) {
  console.error(`[EasyGuide warn]: ${msg}`)
}

export function assert(condition, msg) {
  if (!condition) {
    throw new Error(('[EasyGuide] ' + msg))
  }
}