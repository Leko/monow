import fs from 'fs'

export function watch(dir: string) {
  const watcher = fs.watch(dir, {
    persistent: true,
    recursive: true,
  })

  return watcher;
}
