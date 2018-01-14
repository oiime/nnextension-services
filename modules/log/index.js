const uenv = require('uenv')
const pino = require('pino')
const childProcess = require('child_process')
const stream = require('stream')

const passThrough = new stream.PassThrough()
const log = pino({ level: uenv.get('log.level') }, passThrough)

if (uenv.has('log.files')) {
  const args = [require.resolve('pino-tee')]
  for (let logfile of uenv.get('log.files')) {
    args.push(logfile.level)
    args.push(logfile.filename)
  }
  const child = childProcess.spawn(process.execPath, args, { cwd: uenv.get('dir_root'), env: process.env })

  passThrough.pipe(child.stdin)
}

if (uenv.get('log.stdout')) {
  const pretty = pino.pretty()
  pretty.pipe(process.stdout)
  passThrough.pipe(pretty)
}

module.exports = log
