import { createChromiumSceneRunner } from '@shirabe/core'
import { createReportCenter } from '@shirabe/plugin'
import { ConsolePlugin } from '@shirabe/console-plugin'
import path from 'path'
import fs from 'fs'
import arg from 'arg'

import { RunnerOptions } from '@shirabe/core/dist/scene'

const PACKAGE_NAME = '@shirabe/sharedarraybuffer'
const VERSION = 'v0.0.1'
const HELP_MESSAGE = `
Usage: ${PACKAGE_NAME} [options...] <JSON file>

Options:
  -h, --help     print ${PACKAGE_NAME} command line options
  -v, --version  print version
  --verbose      verbose logs

JSON file format:
{
  "urls": [
    "https://...",
    :
  ]
}
`.trim()

export interface Config {
  urls?: string[]
  options?: RunnerOptions
}

function loadConfig(filepath: string): Config {
  const content = fs.readFileSync(path.resolve(filepath))
  return JSON.parse(content.toString('utf8')) as Config
}

async function main(): Promise<void> {
  const args = arg(
    {
      '--help': Boolean,
      '--version': Boolean,
      '--verbose': Boolean,

      '-h': '--help',
      '-v': '--version',
    },
    { permissive: false, argv: process.argv.slice(2) },
  )

  if (args['--help'] === true) {
    console.warn(HELP_MESSAGE)
    process.exit(0)
  }

  if (args['--version'] === true) {
    console.warn(VERSION)
    process.exit(0)
  }

  const filepath = args._[0] ?? ''
  if (filepath === '') {
    console.warn(`Usage: ${PACKAGE_NAME} [options...] <JSON file>`)
    console.warn('<JSON file> is required.')
    process.exit(1)
  }

  const config = loadConfig(filepath)
  const reportCenter = createReportCenter({ verbose: args['--verbose'] })
  const chromiumSceneRunner = await createChromiumSceneRunner(
    [
      new ConsolePlugin({
        watch: ['warning'],
        filter: message => message.text()?.includes('SharedArrayBuffer'),
      }),
    ],
    reportCenter,
    config.options,
  )

  console.warn(chromiumSceneRunner.browserInfo)

  for (const url of config.urls ?? []) {
    console.warn(url)
    await chromiumSceneRunner.run(url)
  }
  await chromiumSceneRunner.close()
  console.log(JSON.stringify(reportCenter.getReports(), undefined, 2))
  process.exit(0)
}

main().catch(console.error)
